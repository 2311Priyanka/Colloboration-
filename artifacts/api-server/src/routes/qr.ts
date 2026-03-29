import { Router } from "express";
import { db, qrCodesTable, attendanceTable, studentsTable, classesTable, subjectsTable, timetableSlotsTable } from "@workspace/db";
import { eq, and, gt } from "drizzle-orm";
import { authenticate, requireRole } from "../middlewares/authenticate.js";
import crypto from "crypto";

const router = Router();

router.post("/generate", authenticate, requireRole("STAFF", "HOD"), async (req, res) => {
  try {
    const { classId, slotId, expiresInSeconds = 120 } = req.body;
    const staffId = req.user!.staffId;
    if (!staffId) {
      res.status(403).json({ error: "Forbidden" });
      return;
    }

    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + expiresInSeconds * 1000);

    const [qr] = await db.insert(qrCodesTable).values({
      token,
      classId,
      slotId,
      staffId,
      expiresAt,
      used: false,
    }).returning();

    const qrData = JSON.stringify({ token, classId, slotId });

    res.json({
      qrToken: token,
      qrData,
      expiresAt: expiresAt.toISOString(),
      classId,
      slotId,
    });
  } catch (err) {
    req.log?.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/scan", authenticate, requireRole("STUDENT"), async (req, res) => {
  try {
    const { qrToken } = req.body;
    const studentId = req.user!.studentId;
    if (!studentId) {
      res.status(403).json({ error: "Forbidden", message: "Student only" });
      return;
    }

    let parsedToken = qrToken;
    try {
      const parsed = JSON.parse(qrToken);
      if (parsed.token) parsedToken = parsed.token;
    } catch {}

    const [qr] = await db.select().from(qrCodesTable).where(
      and(
        eq(qrCodesTable.token, parsedToken),
        eq(qrCodesTable.used, false),
        gt(qrCodesTable.expiresAt, new Date())
      )
    );

    if (!qr) {
      res.status(400).json({ success: false, message: "QR code is invalid or expired" });
      return;
    }

    const [cls] = await db.select().from(classesTable).where(eq(classesTable.id, qr.classId));
    const [slot] = await db.select({
      subjectName: subjectsTable.name,
    })
      .from(timetableSlotsTable)
      .leftJoin(subjectsTable, eq(subjectsTable.id, timetableSlotsTable.subjectId))
      .where(eq(timetableSlotsTable.id, qr.slotId));

    const [student] = await db.select().from(studentsTable).where(eq(studentsTable.id, studentId));
    if (student && !student.classId) {
      await db.update(studentsTable).set({ classId: qr.classId }).where(eq(studentsTable.id, studentId));
    }

    await db.insert(attendanceTable).values({
      studentId,
      classId: qr.classId,
      qrCodeId: qr.id,
      subjectName: slot?.subjectName || undefined,
    });

    await db.update(qrCodesTable).set({ used: true }).where(eq(qrCodesTable.id, qr.id));

    res.json({
      success: true,
      message: `Attendance marked for ${cls?.name || "class"}`,
      className: cls?.name || "",
      subject: slot?.subjectName || "",
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    req.log?.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
