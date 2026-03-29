import { Router } from "express";
import healthRouter from "./health.js";
import authRouter from "./auth.js";
import subjectsRouter from "./subjects.js";
import classesRouter from "./classes.js";
import timetableRouter from "./timetable.js";
import qrRouter from "./qr.js";
import attendanceRouter from "./attendance.js";
import notesRouter from "./notes.js";
import feedbackRouter from "./feedback.js";
import notificationsRouter from "./notifications.js";
import availabilityRouter from "./availability.js";
import burnoutRouter from "./burnout.js";
import analyticsRouter from "./analytics.js";
import hodRouter from "./hod.js";
import studentsRouter from "./students.js";

const router = Router();

router.use(healthRouter);
router.use("/auth", authRouter);
router.use("/subjects", subjectsRouter);
router.use("/classes", classesRouter);
router.use("/timetable", timetableRouter);
router.use("/qr", qrRouter);
router.use("/attendance", attendanceRouter);
router.use("/notes", notesRouter);
router.use("/feedback", feedbackRouter);
router.use("/notifications", notificationsRouter);
router.use("/availability", availabilityRouter);
router.use("/burnout", burnoutRouter);
router.use("/analytics", analyticsRouter);
router.use("/hod", hodRouter);
router.use("/students", studentsRouter);

export default router;
