import { Router } from "express";
import { db, attendanceTable, studentsTable, classesTable, usersTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { authenticate, requireRole } from "../middlewares/authenticate.js";

const router = Router();

router.get("/my", authenticate, requireRole("STUDENT"), async (req, res) => {
  try {
    const studentId = req.user!.studentId;
    if (!studentId) {
      res.status(403).json({ error: "Forbidden" });
      return;
    }

    const records = await db
      .select({
        id: attendanceTable.id,
        studentId: attendanceTable.studentId,
        classId: attendanceTable.classId,
        className: classesTable.name,
        subjectName: attendanceTable.subjectName,
        timestamp: attendanceTable.timestamp,
      })
      .from(attendanceTable)
      .leftJoin(classesTable, eq(classesTable.id, attendanceTable.classId))
      .where(eq(attendanceTable.studentId, studentId))
      .orderBy(attendanceTable.timestamp);

    res.json(records.map(r => ({
      ...r,
      studentName: req.user!.email,
    })));
  } catch (err) {
    req.log?.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/class/:classId", authenticate, requireRole("STAFF", "HOD"), async (req, res) => {
  try {
    const records = await db
      .select({
        id: attendanceTable.id,
        studentId: attendanceTable.studentId,
        studentName: usersTable.name,
        classId: attendanceTable.classId,
        className: classesTable.name,
        subjectName: attendanceTable.subjectName,
        timestamp: attendanceTable.timestamp,
      })
      .from(attendanceTable)
      .leftJoin(studentsTable, eq(studentsTable.id, attendanceTable.studentId))
      .leftJoin(usersTable, eq(usersTable.id, studentsTable.userId))
      .leftJoin(classesTable, eq(classesTable.id, attendanceTable.classId))
      .where(eq(attendanceTable.classId, req.params.classId));

    res.json(records);
  } catch (err) {
    req.log?.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
