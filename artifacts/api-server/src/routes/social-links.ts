import { Router } from "express";
import { db, socialLinksTable } from "@workspace/db";
import { eq } from "drizzle-orm";

const router = Router();

router.get("/social-links", async (_req, res) => {
  const rows = await db.select().from(socialLinksTable);
  res.json(rows);
});

router.post("/social-links", async (req, res) => {
  const [row] = await db.insert(socialLinksTable).values(req.body).returning();
  res.status(201).json(row);
});

router.put("/social-links/:id", async (req, res) => {
  const [row] = await db.update(socialLinksTable).set(req.body).where(eq(socialLinksTable.id, Number(req.params.id))).returning();
  res.json(row);
});

router.delete("/social-links/:id", async (req, res) => {
  await db.delete(socialLinksTable).where(eq(socialLinksTable.id, Number(req.params.id)));
  res.status(204).send();
});

export default router;
