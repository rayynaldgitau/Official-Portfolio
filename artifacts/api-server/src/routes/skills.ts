import { Router } from "express";
import { db, skillsTable } from "@workspace/db";
import { eq } from "drizzle-orm";

const router = Router();

router.get("/skills", async (_req, res) => {
  const rows = await db.select().from(skillsTable);
  res.json(rows);
});

router.post("/skills", async (req, res) => {
  const [row] = await db.insert(skillsTable).values(req.body).returning();
  res.status(201).json(row);
});

router.put("/skills/:id", async (req, res) => {
  const [row] = await db.update(skillsTable).set(req.body).where(eq(skillsTable.id, Number(req.params.id))).returning();
  res.json(row);
});

router.delete("/skills/:id", async (req, res) => {
  await db.delete(skillsTable).where(eq(skillsTable.id, Number(req.params.id)));
  res.status(204).send();
});

export default router;
