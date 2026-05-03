import { Router, type IRouter } from "express";
import healthRouter from "./health.js";
import messagesRouter from "./messages.js";
import storageRouter from "./storage.js";
import syncRouter from "./sync.js";
import projectsRouter from "./routes/projects.js";
import skillsRouter from "./routes/skills.js";
import experienceRouter from "./routes/experience.js";
import certificationsRouter from "./routes/certifications.js";
import profileRouter from "./routes/profile.js";
import socialLinksRouter from "./routes/social-links.js";
import aboutRouter from "./routes/about.js";

const router: IRouter = Router();

router.use(healthRouter);
router.use(messagesRouter);
router.use(storageRouter);
router.use(syncRouter);
router.use(projectsRouter);
router.use(skillsRouter);
router.use(experienceRouter);
router.use(certificationsRouter);
router.use(profileRouter);
router.use(socialLinksRouter);
router.use(aboutRouter);

export default router;
