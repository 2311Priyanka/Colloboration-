import { Router } from "express";
import { db, subjectsTable, staffTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { authenticate, requireRole } from "../middlewares/authenticate.js";
import { getSingleValue } from "../lib/request.js";

const router = Router();

router.get("/", authenticate, async (req, res) => {
  try {
    let subjects;
    if (req.user!.staffId) {
      subjects = await db.select().from(subjectsTable).where(eq(subjectsTable.staffId, req.user!.staffId));
    } else {
      subjects = await db.select().from(subjectsTable);
    }
    res.json(subjects);
  } catch (err) {
    req.log?.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/", authenticate, requireRole("STAFF", "HOD"), async (req, res) => {
  try {
    const { name, code, type, credits } = req.body;
    const staffId = req.user!.staffId;
    if (!staffId) {
      res.status(403).json({ error: "Forbidden", message: "No staff profile" });
      return;
    }
    const [subject] = await db.insert(subjectsTable).values({ staffId, name, code, type, credits }).returning();
    res.status(201).json(subject);
  } catch (err: any) {
    if (err.code === "23505") {
      res.status(409).json({ error: "Conflict", message: "Subject code already exists" });
      return;
    }
    req.log?.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.put("/:id", authenticate, requireRole("STAFF", "HOD"), async (req, res) => {
  try {
    const subjectId = getSingleValue(req.params.id);
    if (!subjectId) {
      res.status(400).json({ error: "Bad Request", message: "Missing subject id" });
      return;
    }

    const { name, code, type, credits } = req.body;
    const [subject] = await db.update(subjectsTable)
      .set({ name, code, type, credits })
      .where(eq(subjectsTable.id, subjectId))
      .returning();
    if (!subject) {
      res.status(404).json({ error: "Not Found" });
      return;
    }
    res.json(subject);
  } catch (err) {
    req.log?.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.delete("/:id", authenticate, requireRole("STAFF", "HOD"), async (req, res) => {
  try {
    const subjectId = getSingleValue(req.params.id);
    if (!subjectId) {
      res.status(400).json({ error: "Bad Request", message: "Missing subject id" });
      return;
    }

    await db.delete(subjectsTable).where(eq(subjectsTable.id, subjectId));
    res.json({ success: true, message: "Subject deleted" });
  } catch (err) {
    req.log?.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
