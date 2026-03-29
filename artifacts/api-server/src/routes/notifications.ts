import { Router } from "express";
import { db, notificationsTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { authenticate } from "../middlewares/authenticate.js";
import { getSingleValue } from "../lib/request.js";

const router = Router();

router.get("/", authenticate, async (req, res) => {
  try {
    const notifications = await db
      .select()
      .from(notificationsTable)
      .where(eq(notificationsTable.userId, req.user!.userId))
      .orderBy(notificationsTable.createdAt);

    res.json(notifications.reverse());
  } catch (err) {
    req.log?.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.put("/:id/read", authenticate, async (req, res) => {
  try {
    const notificationId = getSingleValue(req.params.id);
    if (!notificationId) {
      res.status(400).json({ error: "Bad Request", message: "Missing notification id" });
      return;
    }

    await db.update(notificationsTable)
      .set({ read: true })
      .where(eq(notificationsTable.id, notificationId));
    res.json({ success: true, message: "Marked as read" });
  } catch (err) {
    req.log?.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
