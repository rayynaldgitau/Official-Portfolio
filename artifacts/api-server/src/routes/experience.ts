import { Router } from "express";
import { db, experienceTable } from "@workspace/db";
import { eq } from "drizzle-orm";

const router = Router();

router.get("/experience", async (_req, res) => {
  const rows = await db.select().from(experienceTable);
  res.json(rows);
});

router.post("/experience", async (req, res) => {
  const [row] = await db.insert(experienceTable).values(req.body).returning();
  res.status(201).json(row);
});

router.put("/experience/:id", async (req, res) => {
  const [row] = await db.update(experienceTable).set(req.body).where(eq(experienceTable.id, Number(req.params.id))).returning();
  res.json(row);
});

router.delete("/experience/:id", async (req, res) => {
  await db.delete(experienceTable).where(eq(experienceTable.id, Number(req.params.id)));
  res.status(204).send();
});

export default router;
