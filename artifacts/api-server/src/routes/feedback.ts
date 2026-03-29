import { Router } from "express";
import { db, feedbackWindowsTable, feedbackTable, classesTable, usersTable, staffTable } from "@workspace/db";
import { eq, count, avg, and, lte, gte } from "drizzle-orm";
import { authenticate, requireRole } from "../middlewares/authenticate.js";

const router = Router();

function analyzeSentiment(comment: string, rating: number): { sentiment: number; label: string } {
  const positiveWords = ["great", "excellent", "good", "helpful", "clear", "understand", "best", "amazing", "wonderful", "fantastic", "love", "perfect", "outstanding"];
  const negativeWords = ["bad", "poor", "confusing", "boring", "slow", "difficult", "unclear", "hard", "terrible", "awful", "hate", "worst", "disappointing"];

  const lower = comment.toLowerCase();
  const posCount = positiveWords.filter(w => lower.includes(w)).length;
  const negCount = negativeWords.filter(w => lower.includes(w)).length;

  const ratingNorm = (rating - 1) / 4;
  const wordSentiment = (posCount - negCount) / Math.max(posCount + negCount, 1);
  const combined = (ratingNorm * 0.6) + ((wordSentiment + 1) / 2 * 0.4);
  const clamped = Math.max(0, Math.min(1, combined));

  let label = "neutral";
  if (clamped >= 0.65) label = "positive";
  else if (clamped < 0.35) label = "negative";

  return { sentiment: clamped, label };
}

router.post("/window", authenticate, requireRole("HOD"), async (req, res) => {
  try {
    const { classId, staffId, durationHours = 48 } = req.body;
    const closesAt = new Date(Date.now() + durationHours * 3600 * 1000);

    const [window] = await db.insert(feedbackWindowsTable).values({
      classId,
      staffId,
      closesAt,
      isActive: true,
    }).returning();

    const [cls] = await db.select().from(classesTable).where(eq(classesTable.id, classId));
    const [staff] = await db.select({ name: usersTable.name })
      .from(staffTable)
      .leftJoin(usersTable, eq(usersTable.id, staffTable.userId))
      .where(eq(staffTable.id, staffId));

    res.status(201).json({
      ...window,
      className: cls?.name || "",
      staffName: staff?.name || "",
      feedbackCount: 0,
    });
  } catch (err) {
    req.log?.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/windows", authenticate, async (req, res) => {
  try {
    const windows = await db
      .select({
        id: feedbackWindowsTable.id,
        classId: feedbackWindowsTable.classId,
        className: classesTable.name,
        staffId: feedbackWindowsTable.staffId,
        staffName: usersTable.name,
        opensAt: feedbackWindowsTable.opensAt,
        closesAt: feedbackWindowsTable.closesAt,
        isActive: feedbackWindowsTable.isActive,
      })
      .from(feedbackWindowsTable)
      .leftJoin(classesTable, eq(classesTable.id, feedbackWindowsTable.classId))
      .leftJoin(staffTable, eq(staffTable.id, feedbackWindowsTable.staffId))
      .leftJoin(usersTable, eq(usersTable.id, staffTable.userId))
      .orderBy(feedbackWindowsTable.createdAt);

    const withCounts = await Promise.all(windows.map(async (w) => {
      const [result] = await db.select({ count: count() }).from(feedbackTable).where(eq(feedbackTable.windowId, w.id));
      return { ...w, feedbackCount: result?.count || 0 };
    }));

    res.json(withCounts);
  } catch (err) {
    req.log?.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/:windowId/submit", authenticate, requireRole("STUDENT"), async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const studentId = req.user!.studentId;
    const [window] = await db.select().from(feedbackWindowsTable).where(eq(feedbackWindowsTable.id, req.params.windowId));

    if (!window || !window.isActive || new Date() > window.closesAt) {
      res.status(400).json({ error: "Bad Request", message: "Feedback window is closed" });
      return;
    }

    const { sentiment, label } = analyzeSentiment(comment, rating);

    const [feedback] = await db.insert(feedbackTable).values({
      windowId: window.id,
      studentId: studentId || null,
      classId: window.classId,
      staffId: window.staffId,
      rating,
      comment,
      sentiment,
      sentimentLabel: label,
    }).returning();

    res.status(201).json(feedback);
  } catch (err) {
    req.log?.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/:windowId", authenticate, requireRole("STAFF", "HOD"), async (req, res) => {
  try {
    const feedbacks = await db.select().from(feedbackTable).where(eq(feedbackTable.windowId, req.params.windowId));

    const total = feedbacks.length;
    const avgRating = total > 0 ? feedbacks.reduce((sum, f) => sum + f.rating, 0) / total : 0;
    const avgSentiment = total > 0 ? feedbacks.reduce((sum, f) => sum + (f.sentiment || 0), 0) / total : 0;

    const breakdown = {
      positive: feedbacks.filter(f => f.sentimentLabel === "positive").length,
      neutral: feedbacks.filter(f => f.sentimentLabel === "neutral").length,
      negative: feedbacks.filter(f => f.sentimentLabel === "negative").length,
    };

    const ratingDist = [1, 2, 3, 4, 5].map(r => ({
      rating: r,
      count: feedbacks.filter(f => f.rating === r).length,
    }));

    res.json({
      windowId: req.params.windowId,
      totalFeedback: total,
      averageRating: Math.round(avgRating * 100) / 100,
      averageSentiment: Math.round(avgSentiment * 100) / 100,
      sentimentBreakdown: breakdown,
      feedbacks: feedbacks.map(f => ({ ...f, studentName: "Anonymous" })),
      ratingDistribution: ratingDist,
    });
  } catch (err) {
    req.log?.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
