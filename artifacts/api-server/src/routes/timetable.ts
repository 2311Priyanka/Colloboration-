import { Router } from "express";
import {
  db, timetablesTable, timetableSlotsTable, classesTable,
  allocationsTable, subjectsTable, staffTable, usersTable
} from "@workspace/db";
import { eq } from "drizzle-orm";
import { authenticate, requireRole } from "../middlewares/authenticate.js";

const router = Router();

const DAYS = ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY"] as const;
const TIME_SLOTS = [
  { start: "08:30", end: "09:30" },
  { start: "09:30", end: "10:30" },
  { start: "10:45", end: "11:45" },
  { start: "11:45", end: "12:45" },
  { start: "14:00", end: "15:00" },
  { start: "15:00", end: "16:00" },
  { start: "16:00", end: "17:00" },
];

async function buildTimetableResponse(timetableId: string, classId: string, version: number, updatedAt: Date, className: string) {
  const slots = await db
    .select({
      id: timetableSlotsTable.id,
      day: timetableSlotsTable.day,
      startTime: timetableSlotsTable.startTime,
      endTime: timetableSlotsTable.endTime,
      subjectId: timetableSlotsTable.subjectId,
      subjectName: subjectsTable.name,
      subjectCode: subjectsTable.code,
      subjectType: timetableSlotsTable.subjectType,
      room: timetableSlotsTable.room,
      staffId: timetableSlotsTable.staffId,
      staffName: usersTable.name,
      classId: timetableSlotsTable.classId,
    })
    .from(timetableSlotsTable)
    .leftJoin(subjectsTable, eq(subjectsTable.id, timetableSlotsTable.subjectId))
    .leftJoin(staffTable, eq(staffTable.id, timetableSlotsTable.staffId))
    .leftJoin(usersTable, eq(usersTable.id, staffTable.userId))
    .where(eq(timetableSlotsTable.timetableId, timetableId));

  return {
    id: timetableId,
    classId,
    className,
    version,
    updatedAt: updatedAt.toISOString(),
    slots: slots.map(s => ({
      ...s,
      className,
    })),
  };
}

router.get("/staff/me", authenticate, async (req, res) => {
  try {
    const staffId = req.user!.staffId;
    if (!staffId) {
      res.status(403).json({ error: "Forbidden", message: "Staff only" });
      return;
    }

    const slots = await db
      .select({
        id: timetableSlotsTable.id,
        day: timetableSlotsTable.day,
        startTime: timetableSlotsTable.startTime,
        endTime: timetableSlotsTable.endTime,
        subjectId: timetableSlotsTable.subjectId,
        subjectName: subjectsTable.name,
        subjectCode: subjectsTable.code,
        subjectType: timetableSlotsTable.subjectType,
        room: timetableSlotsTable.room,
        staffId: timetableSlotsTable.staffId,
        staffName: usersTable.name,
        classId: timetableSlotsTable.classId,
        className: classesTable.name,
      })
      .from(timetableSlotsTable)
      .leftJoin(subjectsTable, eq(subjectsTable.id, timetableSlotsTable.subjectId))
      .leftJoin(staffTable, eq(staffTable.id, timetableSlotsTable.staffId))
      .leftJoin(usersTable, eq(usersTable.id, staffTable.userId))
      .leftJoin(classesTable, eq(classesTable.id, timetableSlotsTable.classId))
      .where(eq(timetableSlotsTable.staffId, staffId));

    res.json(slots);
  } catch (err) {
    req.log?.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/:classId", authenticate, async (req, res) => {
  try {
    const [cls] = await db.select().from(classesTable).where(eq(classesTable.id, req.params.classId));
    if (!cls) {
      res.status(404).json({ error: "Not Found", message: "Class not found" });
      return;
    }

    const [timetable] = await db.select().from(timetablesTable).where(eq(timetablesTable.classId, req.params.classId));
    if (!timetable) {
      res.json({ id: "none", classId: cls.id, className: cls.name, version: 0, slots: [] });
      return;
    }

    const result = await buildTimetableResponse(timetable.id, cls.id, timetable.version, timetable.updatedAt, cls.name);
    res.json(result);
  } catch (err) {
    req.log?.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/:classId/generate", authenticate, requireRole("HOD", "STAFF"), async (req, res) => {
  try {
    const { classId } = req.params;
    const [cls] = await db.select().from(classesTable).where(eq(classesTable.id, classId));
    if (!cls) {
      res.status(404).json({ error: "Not Found", message: "Class not found" });
      return;
    }

    const allocations = await db
      .select({
        staffId: allocationsTable.staffId,
        subjectId: allocationsTable.subjectId,
        subjectType: allocationsTable.type,
        subjectName: subjectsTable.name,
        subjectCode: subjectsTable.code,
        credits: subjectsTable.credits,
      })
      .from(allocationsTable)
      .leftJoin(subjectsTable, eq(subjectsTable.id, allocationsTable.subjectId))
      .where(eq(allocationsTable.classId, classId));

    const rooms = ["Room 101", "Room 102", "Room 103", "Lab A", "Lab B", "Room 201", "Room 202"];

    const slotAssignments: Array<{
      day: typeof DAYS[number];
      startTime: string;
      endTime: string;
      subjectId: string;
      subjectType: "THEORY" | "LAB";
      room: string;
      staffId: string;
    }> = [];

    const staffDayLoad: Record<string, Record<string, number>> = {};
    let allocIdx = 0;
    let timeSlotIdx = 0;

    for (const day of DAYS) {
      for (let t = 0; t < TIME_SLOTS.length && allocIdx < allocations.length; t++) {
        const alloc = allocations[allocIdx % allocations.length];
        if (!alloc.staffId || !alloc.subjectId) continue;

        const slot = TIME_SLOTS[timeSlotIdx % TIME_SLOTS.length];
        const room = alloc.subjectType === "LAB" ? (rooms[3 + (allocIdx % 2)]) : rooms[allocIdx % 3];

        slotAssignments.push({
          day,
          startTime: slot.start,
          endTime: slot.end,
          subjectId: alloc.subjectId,
          subjectType: alloc.subjectType as "THEORY" | "LAB",
          room,
          staffId: alloc.staffId,
        });

        allocIdx++;
        timeSlotIdx++;
        if (allocIdx >= allocations.length) break;
      }
      if (allocIdx >= allocations.length * 1) {
        allocIdx = 0;
        timeSlotIdx++;
      }
    }

    const [existing] = await db.select().from(timetablesTable).where(eq(timetablesTable.classId, classId));

    let timetableId: string;
    let version: number;
    const now = new Date();

    if (existing) {
      await db.delete(timetableSlotsTable).where(eq(timetableSlotsTable.timetableId, existing.id));
      const [updated] = await db.update(timetablesTable)
        .set({ version: existing.version + 1, updatedAt: now })
        .where(eq(timetablesTable.id, existing.id))
        .returning();
      timetableId = updated.id;
      version = updated.version;
    } else {
      const [created] = await db.insert(timetablesTable).values({ classId }).returning();
      timetableId = created.id;
      version = created.version;
    }

    if (slotAssignments.length > 0) {
      await db.insert(timetableSlotsTable).values(
        slotAssignments.map(s => ({
          timetableId,
          classId,
          day: s.day,
          startTime: s.startTime,
          endTime: s.endTime,
          subjectId: s.subjectId,
          subjectType: s.subjectType,
          room: s.room,
          staffId: s.staffId,
        }))
      );
    }

    const result = await buildTimetableResponse(timetableId, cls.id, version, now, cls.name);
    res.json(result);
  } catch (err) {
    req.log?.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
