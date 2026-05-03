import { Router } from "express";
import { db, projectsTable } from "@workspace/db";
import { eq } from "drizzle-orm";

const router = Router();

router.get("/projects", async (_req, res) => {
  const rows = await db.select().from(projectsTable);
  res.json(rows);
});

router.post("/projects", async (req, res) => {
  const [row] = await db.insert(projectsTable).values(req.body).returning();
  res.status(201).json(row);
});

router.put("/projects/:id", async (req, res) => {
  const [row] = await db.update(projectsTable).set(req.body).where(eq(projectsTable.id, Number(req.params.id))).returning();
  res.json(row);
});

router.delete("/projects/:id", async (req, res) => {
  await db.delete(projectsTable).where(eq(projectsTable.id, Number(req.params.id)));
  res.status(204).send();
});

export default router;
