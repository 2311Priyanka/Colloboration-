import { Router } from "express";
import { db, notesTable, usersTable, staffTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { authenticate, requireRole } from "../middlewares/authenticate.js";
import { getSingleValue } from "../lib/request.js";

const router = Router();

router.get("/:classId", authenticate, async (req, res) => {
  try {
    const classId = getSingleValue(req.params.classId);
    if (!classId) {
      res.status(400).json({ error: "Bad Request", message: "Missing class id" });
      return;
    }

    const notes = await db
      .select({
        id: notesTable.id,
        classId: notesTable.classId,
        staffId: notesTable.staffId,
        staffName: usersTable.name,
        content: notesTable.content,
        createdAt: notesTable.createdAt,
        updatedAt: notesTable.updatedAt,
      })
      .from(notesTable)
      .leftJoin(staffTable, eq(staffTable.id, notesTable.staffId))
      .leftJoin(usersTable, eq(usersTable.id, staffTable.userId))
      .where(eq(notesTable.classId, classId))
      .orderBy(notesTable.createdAt);

    res.json(notes);
  } catch (err) {
    req.log?.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/:classId", authenticate, requireRole("STAFF", "HOD"), async (req, res) => {
  try {
    const classId = getSingleValue(req.params.classId);
    if (!classId) {
      res.status(400).json({ error: "Bad Request", message: "Missing class id" });
      return;
    }

    const { content } = req.body;
    const staffId = req.user!.staffId;
    if (!staffId) {
      res.status(403).json({ error: "Forbidden" });
      return;
    }

    const [note] = await db.insert(notesTable).values({
      classId,
      staffId,
      content,
    }).returning();

    const [staffUser] = await db.select({ name: usersTable.name })
      .from(staffTable)
      .leftJoin(usersTable, eq(usersTable.id, staffTable.userId))
      .where(eq(staffTable.id, staffId));

    res.status(201).json({ ...note, staffName: staffUser?.name || "" });
  } catch (err) {
    req.log?.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.put("/:classId/:noteId", authenticate, requireRole("STAFF", "HOD"), async (req, res) => {
  try {
    const noteId = getSingleValue(req.params.noteId);
    if (!noteId) {
      res.status(400).json({ error: "Bad Request", message: "Missing note id" });
      return;
    }

    const { content } = req.body;
    const [note] = await db.update(notesTable)
      .set({ content, updatedAt: new Date() })
      .where(eq(notesTable.id, noteId))
      .returning();

    const staffUser = await db.select({ name: usersTable.name })
      .from(staffTable)
      .leftJoin(usersTable, eq(usersTable.id, staffTable.userId))
      .where(eq(staffTable.id, note.staffId));

    res.json({ ...note, staffName: staffUser[0]?.name || "" });
  } catch (err) {
    req.log?.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.delete("/:classId/:noteId", authenticate, requireRole("STAFF", "HOD"), async (req, res) => {
  try {
    const noteId = getSingleValue(req.params.noteId);
    if (!noteId) {
      res.status(400).json({ error: "Bad Request", message: "Missing note id" });
      return;
    }

    await db.delete(notesTable).where(eq(notesTable.id, noteId));
    res.json({ success: true, message: "Note deleted" });
  } catch (err) {
    req.log?.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
