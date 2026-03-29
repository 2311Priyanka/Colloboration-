import { Router } from "express";
import { db, studentsTable, classesTable, allocationsTable, usersTable, staffTable, subjectsTable } from "@workspace/db";
import { eq, count } from "drizzle-orm";
import { authenticate, requireRole } from "../middlewares/authenticate.js";

const router = Router();

router.post("/join-class", authenticate, requireRole("STUDENT"), async (req, res) => {
  try {
    const { classCode } = req.body;
    const studentId = req.user!.studentId;
    if (!studentId) {
      res.status(403).json({ error: "Forbidden" });
      return;
    }

    const [cls] = await db.select().from(classesTable).where(eq(classesTable.classCode, classCode));
    if (!cls) {
      res.status(404).json({ error: "Not Found", message: "Invalid class code" });
      return;
    }

    await db.update(studentsTable).set({ classId: cls.id }).where(eq(studentsTable.id, studentId));
    res.json({ success: true, message: `Successfully joined class ${cls.name}` });
  } catch (err) {
    req.log?.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/my-class", authenticate, requireRole("STUDENT"), async (req, res) => {
  try {
    const studentId = req.user!.studentId;
    if (!studentId) {
      res.status(403).json({ error: "Forbidden" });
      return;
    }

    const [student] = await db.select().from(studentsTable).where(eq(studentsTable.id, studentId));
    if (!student?.classId) {
      res.status(404).json({ error: "Not Found", message: "No class assigned" });
      return;
    }

    const [cls] = await db.select().from(classesTable).where(eq(classesTable.id, student.classId));
    if (!cls) {
      res.status(404).json({ error: "Not Found" });
      return;
    }

    const rawAllocs = await db
      .select({
        id: allocationsTable.id,
        classId: allocationsTable.classId,
        staffId: allocationsTable.staffId,
        staffName: usersTable.name,
        subjectId: allocationsTable.subjectId,
        subjectName: subjectsTable.name,
        subjectCode: subjectsTable.code,
        type: allocationsTable.type,
      })
      .from(allocationsTable)
      .leftJoin(staffTable, eq(staffTable.id, allocationsTable.staffId))
      .leftJoin(usersTable, eq(usersTable.id, staffTable.userId))
      .leftJoin(subjectsTable, eq(subjectsTable.id, allocationsTable.subjectId))
      .where(eq(allocationsTable.classId, cls.id));

    const [enrollmentResult] = await db.select({ count: count() }).from(studentsTable).where(eq(studentsTable.classId, cls.id));

    res.json({
      ...cls,
      allocations: rawAllocs,
      studentEnrollment: enrollmentResult?.count || 0,
    });
  } catch (err) {
    req.log?.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
