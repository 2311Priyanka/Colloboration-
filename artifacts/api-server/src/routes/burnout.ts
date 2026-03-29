import { Router } from "express";
import {
  db, staffTable, usersTable, timetableSlotsTable, feedbackTable,
  availabilityTable, attendanceTable, studentsTable
} from "@workspace/db";
import { eq, count, avg } from "drizzle-orm";
import { authenticate, requireRole } from "../middlewares/authenticate.js";

const router = Router();

async function calculateBurnout(staffId: string) {
  const [staffUser] = await db
    .select({ name: usersTable.name, department: usersTable.department, designation: staffTable.designation })
    .from(staffTable)
    .leftJoin(usersTable, eq(usersTable.id, staffTable.userId))
    .where(eq(staffTable.id, staffId));

  const slots = await db.select().from(timetableSlotsTable).where(eq(timetableSlotsTable.staffId, staffId));

  let weeklyHours = 0;
  const dayLoad: Record<string, number> = {};
  for (const slot of slots) {
    const [sh, sm] = slot.startTime.split(":").map(Number);
    const [eh, em] = slot.endTime.split(":").map(Number);
    const hours = (eh + em / 60) - (sh + sm / 60);
    weeklyHours += hours;
    dayLoad[slot.day] = (dayLoad[slot.day] || 0) + hours;
  }

  const consecutiveDays = Object.values(dayLoad).filter(h => h >= 4).length;

  const [unavailResult] = await db.select({ count: count() }).from(availabilityTable).where(eq(availabilityTable.staffId, staffId));
  const substituteCount = unavailResult?.count || 0;

  const feedbacks = await db.select({ sentiment: feedbackTable.sentiment }).from(feedbackTable).where(eq(feedbackTable.staffId, staffId));
  const avgSentiment = feedbacks.length > 0
    ? feedbacks.reduce((sum, f) => sum + (f.sentiment || 0.5), 0) / feedbacks.length
    : 0.7;

  const weeklyHoursScore = Math.min((weeklyHours / 20) * 40, 40);
  const consecutiveDaysScore = Math.min((consecutiveDays / 5) * 20, 20);
  const substituteFrequencyScore = Math.min((substituteCount / 10) * 20, 20);
  const sentimentScore = Math.max(0, (1 - avgSentiment) * 20);

  const burnoutScore = Math.round(weeklyHoursScore + consecutiveDaysScore + substituteFrequencyScore + sentimentScore);
  const riskLevel = burnoutScore <= 30 ? "low" : burnoutScore <= 60 ? "medium" : "high";

  const recommendations: string[] = [];
  if (weeklyHours > 18) recommendations.push("Reduce weekly teaching load by 2-4 hours");
  if (consecutiveDays >= 4) recommendations.push("Schedule at least 1 free day per week");
  if (substituteCount > 5) recommendations.push("Review substitute frequency - possible burnout signal");
  if (avgSentiment < 0.5) recommendations.push("Consider pedagogy support and professional development");

  return {
    staffId,
    staffName: staffUser?.name || "Unknown",
    burnoutScore,
    riskLevel,
    weeklyHours: Math.round(weeklyHours * 10) / 10,
    consecutiveDays,
    substituteCount,
    averageSentiment: Math.round(avgSentiment * 100) / 100,
    recommendations,
    breakdown: {
      weeklyHoursScore,
      consecutiveDaysScore,
      substituteFrequencyScore,
      sentimentScore,
    },
  };
}

router.get("/staff/:staffId", authenticate, async (req, res) => {
  try {
    const analysis = await calculateBurnout(req.params.staffId);
    res.json(analysis);
  } catch (err) {
    req.log?.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/all", authenticate, requireRole("HOD"), async (req, res) => {
  try {
    const allStaff = await db
      .select({ id: staffTable.id, name: usersTable.name, department: usersTable.department })
      .from(staffTable)
      .leftJoin(usersTable, eq(usersTable.id, staffTable.userId));

    const results = await Promise.all(allStaff.map(async (s) => {
      const analysis = await calculateBurnout(s.id);
      return {
        staffId: s.id,
        staffName: s.name || "Unknown",
        department: s.department || "",
        burnoutScore: analysis.burnoutScore,
        riskLevel: analysis.riskLevel,
        weeklyHours: analysis.weeklyHours,
      };
    }));

    res.json(results);
  } catch (err) {
    req.log?.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
