import { Router, type IRouter } from "express";
import healthRouter from "./health";
import messagesRouter from "./messages";
import storageRouter from "./storage";
import syncRouter from "./sync";
import { db } from "@workspace/db";
import { projectsTable, skillsTable, experienceTable, certificationsTable, profileTable, socialLinksTable, aboutTable } from "@workspace/db";
import { eq } from "drizzle-orm";

const router: IRouter = Router();

router.use(healthRouter);
router.use(messagesRouter);
router.use(storageRouter);
router.use(syncRouter);

// Projects
router.get("/projects", async (_req, res) => { const rows = await db.select().from(projectsTable); res.json(rows); });
router.post("/projects", async (req, res) => { const [row] = await db.insert(projectsTable).values(req.body).returning(); res.status(201).json(row); });
router.put("/projects/:id", async (req, res) => { const [row] = await db.update(projectsTable).set(req.body).where(eq(projectsTable.id, Number(req.params.id))).returning(); res.json(row); });
router.delete("/projects/:id", async (req, res) => { await db.delete(projectsTable).where(eq(projectsTable.id, Number(req.params.id))); res.status(204).send(); });

// Skills
router.get("/skills", async (_req, res) => { const rows = await db.select().from(skillsTable); res.json(rows); });
router.post("/skills", async (req, res) => { const [row] = await db.insert(skillsTable).values(req.body).returning(); res.status(201).json(row); });
router.put("/skills/:id", async (req, res) => { const [row] = await db.update(skillsTable).set(req.body).where(eq(skillsTable.id, Number(req.params.id))).returning(); res.json(row); });
router.delete("/skills/:id", async (req, res) => { await db.delete(skillsTable).where(eq(skillsTable.id, Number(req.params.id))); res.status(204).send(); });

// Experience
router.get("/experience", async (_req, res) => { const rows = await db.select().from(experienceTable); res.json(rows); });
router.post("/experience", async (req, res) => { const [row] = await db.insert(experienceTable).values(req.body).returning(); res.status(201).json(row); });
router.put("/experience/:id", async (req, res) => { const [row] = await db.update(experienceTable).set(req.body).where(eq(experienceTable.id, Number(req.params.id))).returning(); res.json(row); });
router.delete("/experience/:id", async (req, res) => { await db.delete(experienceTable).where(eq(experienceTable.id, Number(req.params.id))); res.status(204).send(); });

// Certifications
router.get("/certifications", async (_req, res) => { const rows = await db.select().from(certificationsTable); res.json(rows); });
router.post("/certifications", async (req, res) => { const [row] = await db.insert(certificationsTable).values(req.body).returning(); res.status(201).json(row); });
router.put("/certifications/:id", async (req, res) => { const [row] = await db.update(certificationsTable).set(req.body).where(eq(certificationsTable.id, Number(req.params.id))).returning(); res.json(row); });
router.delete("/certifications/:id", async (req, res) => { await db.delete(certificationsTable).where(eq(certificationsTable.id, Number(req.params.id))); res.status(204).send(); });

// Profile
router.get("/profile", async (_req, res) => { const rows = await db.select().from(profileTable); res.json(rows[0] ?? null); });
router.post("/profile", async (req, res) => {
  const existing = await db.select().from(profileTable);
  if (existing.length > 0) { const [row] = await db.update(profileTable).set(req.body).where(eq(profileTable.id, existing[0].id)).returning(); res.json(row); }
  else { const [row] = await db.insert(profileTable).values(req.body).returning(); res.status(201).json(row); }
});

// Social Links
router.get("/social-links", async (_req, res) => { const rows = await db.select().from(socialLinksTable); res.json(rows); });
router.post("/social-links", async (req, res) => { const [row] = await db.insert(socialLinksTable).values(req.body).returning(); res.status(201).json(row); });
router.put("/social-links/:id", async (req, res) => { const [row] = await db.update(socialLinksTable).set(req.body).where(eq(socialLinksTable.id, Number(req.params.id))).returning(); res.json(row); });
router.delete("/social-links/:id", async (req, res) => { await db.delete(socialLinksTable).where(eq(socialLinksTable.id, Number(req.params.id))); res.status(204).send(); });

// About
router.get("/about", async (_req, res) => { const rows = await db.select().from(aboutTable); res.json(rows[0] ?? null); });
router.post("/about", async (req, res) => {
  const existing = await db.select().from(aboutTable);
  if (existing.length > 0) { const [row] = await db.update(aboutTable).set(req.body).where(eq(aboutTable.id, existing[0].id)).returning(); res.json(row); }
  else { const [row] = await db.insert(aboutTable).values(req.body).returning(); res.status(201).json(row); }
});

export default router;