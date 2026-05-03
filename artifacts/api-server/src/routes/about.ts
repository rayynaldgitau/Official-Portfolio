import { Router } from "express";
import { db, aboutTable } from "@workspace/db";
import { eq } from "drizzle-orm";

const router = Router();

router.get("/about", async (_req, res) => {
  const rows = await db.select().from(aboutTable);
  res.json(rows[0] ?? null);
});

router.post("/about", async (req, res) => {
  const existing = await db.select().from(aboutTable);
  if (existing.length > 0) {
    const [row] = await db.update(aboutTable).set(req.body).where(eq(aboutTable.id, existing[0].id)).returning();
    res.json(row);
  } else {
    const [row] = await db.insert(aboutTable).values(req.body).returning();
    res.status(201).json(row);
  }
});

export default router;
