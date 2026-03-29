import { Router } from "express";
import {
  db, staffTable, usersTable, subjectsTable, scheduleConfigTable
} from "@workspace/db";
import { eq } from "drizzle-orm";
import { authenticate, requireRole } from "../middlewares/authenticate.js";

const router = Router();

router.get("/staff", authenticate, requireRole("HOD"), async (req, res) => {
  try {
    const allStaff = await db
      .select({
        id: staffTable.id,
        userId: staffTable.userId,
        name: usersTable.name,
        email: usersTable.email,
        department: usersTable.department,
        designation: staffTable.designation,
        phone: usersTable.phone,
        burnoutScore: staffTable.burnoutScore,
      })
      .from(staffTable)
      .leftJoin(usersTable, eq(usersTable.id, staffTable.userId));

    const withSubjects = await Promise.all(allStaff.map(async (s) => {
      const subjects = await db.select().from(subjectsTable).where(eq(subjectsTable.staffId, s.id));
      const weeklyHours = subjects.length * 2.5;
      return {
        ...s,
        subjects,
        weeklyHours: Math.round(weeklyHours * 10) / 10,
      };
    }));

    res.json(withSubjects);
  } catch (err) {
    req.log?.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/schedule-config", authenticate, async (req, res) => {
  try {
    const [user] = await db.select().from(usersTable).where(eq(usersTable.id, req.user!.userId));
    const [config] = await db.select().from(scheduleConfigTable).where(eq(scheduleConfigTable.department, user.department));

    if (!config) {
      res.json({
        department: user.department,
        labStartTime: "08:30",
        labEndTime: "16:30",
        teaBreakStart: "10:30",
        teaBreakEnd: "10:45",
        lunchBreakStart: "13:00",
        lunchBreakEnd: "14:00",
        maxContinuousHours: 2,
        maxWeeklyHours: 20,
      });
      return;
    }
    res.json(config);
  } catch (err) {
    req.log?.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/schedule-config", authenticate, requireRole("HOD"), async (req, res) => {
  try {
    const [user] = await db.select().from(usersTable).where(eq(usersTable.id, req.user!.userId));
    const data = { ...req.body, department: user.department };

    const [existing] = await db.select().from(scheduleConfigTable).where(eq(scheduleConfigTable.department, user.department));
    if (existing) {
      const [updated] = await db.update(scheduleConfigTable)
        .set({ ...data, updatedAt: new Date() })
        .where(eq(scheduleConfigTable.id, existing.id))
        .returning();
      res.json(updated);
    } else {
      const [created] = await db.insert(scheduleConfigTable).values(data).returning();
      res.json(created);
    }
  } catch (err) {
    req.log?.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
