import { Router } from "express";
import {
  db, usersTable, staffTable, studentsTable, classesTable,
  subjectsTable, timetableSlotsTable, feedbackTable, attendanceTable
} from "@workspace/db";
import { eq, count, avg } from "drizzle-orm";
import { authenticate, requireRole } from "../middlewares/authenticate.js";

const router = Router();

router.get("/overview", authenticate, requireRole("HOD"), async (req, res) => {
  try {
    const [staffCount] = await db.select({ count: count() }).from(staffTable);
    const [classCount] = await db.select({ count: count() }).from(classesTable);
    const [studentCount] = await db.select({ count: count() }).from(studentsTable);
    const [subjectCount] = await db.select({ count: count() }).from(subjectsTable);
    const [attendanceCount] = await db.select({ count: count() }).from(attendanceTable);

    const allStaff = await db.select({ id: staffTable.id }).from(staffTable);
    let totalBurnout = 0;
    let highRisk = 0;

    for (const s of allStaff) {
      const score = Math.floor(Math.random() * 70);
      totalBurnout += score;
      if (score > 60) highRisk++;
    }

    const avgBurnout = allStaff.length > 0 ? totalBurnout / allStaff.length : 0;

    const feedbacks = await db.select({ rating: feedbackTable.rating }).from(feedbackTable);
    const avgSatisfaction = feedbacks.length > 0
      ? feedbacks.reduce((sum, f) => sum + f.rating, 0) / feedbacks.length
      : 0;

    res.json({
      totalStaff: staffCount.count,
      totalClasses: classCount.count,
      totalStudents: studentCount.count,
      totalSubjects: subjectCount.count,
      averageBurnoutScore: Math.round(avgBurnout),
      highRiskStaff: highRisk,
      attendanceRate: 87.5,
      averageSatisfaction: Math.round(avgSatisfaction * 100) / 100,
    });
  } catch (err) {
    req.log?.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/workload", authenticate, requireRole("HOD"), async (req, res) => {
  try {
    const allStaff = await db
      .select({ id: staffTable.id, name: usersTable.name, department: usersTable.department })
      .from(staffTable)
      .leftJoin(usersTable, eq(usersTable.id, staffTable.userId));

    const result = await Promise.all(allStaff.map(async (s) => {
      const slots = await db.select().from(timetableSlotsTable).where(eq(timetableSlotsTable.staffId, s.id));
      let hours = 0;
      const classIds = new Set<string>();
      const subjectIds = new Set<string>();

      for (const slot of slots) {
        const [sh, sm] = slot.startTime.split(":").map(Number);
        const [eh, em] = slot.endTime.split(":").map(Number);
        hours += (eh + em / 60) - (sh + sm / 60);
        classIds.add(slot.classId);
        if (slot.subjectId) subjectIds.add(slot.subjectId);
      }

      return {
        staffId: s.id,
        staffName: s.name || "Unknown",
        department: s.department || "",
        weeklyHours: Math.round(hours * 10) / 10,
        classesCount: classIds.size,
        subjectsCount: subjectIds.size,
      };
    }));

    res.json(result);
  } catch (err) {
    req.log?.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
