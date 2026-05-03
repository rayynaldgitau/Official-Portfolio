import { Router } from "express";
import { db, profileTable } from "@workspace/db";
import { eq } from "drizzle-orm";

const router = Router();

router.get("/profile", async (_req, res) => {
  const rows = await db.select().from(profileTable);
  res.json(rows[0] ?? null);
});

router.post("/profile", async (req, res) => {
  const existing = await db.select().from(profileTable);
  if (existing.length > 0) {
    const [row] = await db.update(profileTable).set(req.body).where(eq(profileTable.id, existing[0].id)).returning();
    res.json(row);
  } else {
    const [row] = await db.insert(profileTable).values(req.body).returning();
    res.status(201).json(row);
  }
});

export default router;
