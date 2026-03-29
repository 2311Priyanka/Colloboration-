import { Router } from "express";
import { db, notificationsTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { authenticate } from "../middlewares/authenticate.js";

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
    await db.update(notificationsTable)
      .set({ read: true })
      .where(eq(notificationsTable.id, req.params.id));
    res.json({ success: true, message: "Marked as read" });
  } catch (err) {
    req.log?.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
