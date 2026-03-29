import { Router } from "express";
import { db, classesTable, allocationsTable, usersTable, staffTable, subjectsTable, studentsTable } from "@workspace/db";
import { eq, count } from "drizzle-orm";
import { authenticate, requireRole } from "../middlewares/authenticate.js";
import { getSingleValue } from "../lib/request.js";

const router = Router();

router.get("/", authenticate, async (req, res) => {
  try {
    const classes = await db.select().from(classesTable);
    const result = await Promise.all(classes.map(async (c) => {
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
        .where(eq(allocationsTable.classId, c.id));

      const [enrollmentResult] = await db.select({ count: count() }).from(studentsTable).where(eq(studentsTable.classId, c.id));

      return {
        ...c,
        allocations: rawAllocs,
        studentEnrollment: enrollmentResult?.count || 0,
      };
    }));
    res.json(result);
  } catch (err) {
    req.log?.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/", authenticate, requireRole("HOD"), async (req, res) => {
  try {
    const { name, department, semester, studentCount } = req.body;
    const [cls] = await db.insert(classesTable).values({ name, department, semester, studentCount }).returning();
    res.status(201).json({ ...cls, allocations: [], studentEnrollment: 0 });
  } catch (err) {
    req.log?.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/:id", authenticate, async (req, res) => {
  try {
    const classId = getSingleValue(req.params.id);
    if (!classId) {
      res.status(400).json({ error: "Bad Request", message: "Missing class id" });
      return;
    }

    const [cls] = await db.select().from(classesTable).where(eq(classesTable.id, classId));
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

    res.json({ ...cls, allocations: rawAllocs, studentEnrollment: enrollmentResult?.count || 0 });
  } catch (err) {
    req.log?.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/:id/allocations", authenticate, requireRole("HOD"), async (req, res) => {
  try {
    const classId = getSingleValue(req.params.id);
    if (!classId) {
      res.status(400).json({ error: "Bad Request", message: "Missing class id" });
      return;
    }

    const { staffId, subjectId, type } = req.body;
    const [alloc] = await db.insert(allocationsTable).values({
      classId,
      staffId,
      subjectId,
      type,
    }).returning();
    res.status(201).json(alloc);
  } catch (err: any) {
    if (err.code === "23505") {
      res.status(409).json({ error: "Conflict", message: "Allocation already exists for this subject type" });
      return;
    }
    req.log?.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
