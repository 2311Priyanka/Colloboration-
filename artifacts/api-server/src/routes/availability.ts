import { Router } from "express";
import { db, availabilityTable, staffTable, usersTable, notificationsTable, usersTable as ut } from "@workspace/db";
import { eq } from "drizzle-orm";
import { authenticate, requireRole } from "../middlewares/authenticate.js";

const router = Router();

router.post("/", authenticate, requireRole("STAFF", "HOD"), async (req, res) => {
  try {
    const { date, reason, notes } = req.body;
    const staffId = req.user!.staffId;
    if (!staffId) {
      res.status(403).json({ error: "Forbidden" });
      return;
    }

    const [avail] = await db.insert(availabilityTable).values({
      staffId,
      date: new Date(date),
      isAvailable: false,
      reason,
      notes,
    }).returning();

    const hodUsers = await db.select().from(usersTable).where(eq(usersTable.role, "HOD"));
    for (const hod of hodUsers) {
      await db.insert(notificationsTable).values({
        userId: hod.id,
        message: `Staff marked unavailable on ${date}. Reason: ${reason}`,
        type: "ABSENCE_ALERT",
      });
    }

    const [staffUser] = await db.select({ name: usersTable.name })
      .from(staffTable)
      .leftJoin(usersTable, eq(usersTable.id, staffTable.userId))
      .where(eq(staffTable.id, staffId));

    res.status(201).json({ ...avail, staffName: staffUser?.name || "" });
  } catch (err) {
    req.log?.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/", authenticate, async (req, res) => {
  try {
    const records = await db
      .select({
        id: availabilityTable.id,
        staffId: availabilityTable.staffId,
        staffName: usersTable.name,
        date: availabilityTable.date,
        isAvailable: availabilityTable.isAvailable,
        reason: availabilityTable.reason,
        notes: availabilityTable.notes,
      })
      .from(availabilityTable)
      .leftJoin(staffTable, eq(staffTable.id, availabilityTable.staffId))
      .leftJoin(usersTable, eq(usersTable.id, staffTable.userId))
      .orderBy(availabilityTable.date);

    res.json(records);
  } catch (err) {
    req.log?.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
