import { Router } from "express";
import { db, certificationsTable } from "@workspace/db";
import { eq } from "drizzle-orm";

const router = Router();

router.get("/certifications", async (_req, res) => {
  const rows = await db.select().from(certificationsTable);
  res.json(rows);
});

router.post("/certifications", async (req, res) => {
  const [row] = await db.insert(certificationsTable).values(req.body).returning();
  res.status(201).json(row);
});

router.put("/certifications/:id", async (req, res) => {
  const [row] = await db.update(certificationsTable).set(req.body).where(eq(certificationsTable.id, Number(req.params.id))).returning();
  res.json(row);
});

router.delete("/certifications/:id", async (req, res) => {
  await db.delete(certificationsTable).where(eq(certificationsTable.id, Number(req.params.id)));
  res.status(204).send();
});

export default router;
