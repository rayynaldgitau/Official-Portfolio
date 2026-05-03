import { Router, type IRouter } from "express";
import healthRouter from "./health";
import messagesRouter from "./messages";
import storageRouter from "./storage";
import syncRouter from "./sync";
import projectsRouter from "./routes/projects";
import skillsRouter from "./routes/skills";
import experienceRouter from "./routes/experience";
import certificationsRouter from "./routes/certifications";
import profileRouter from "./routes/profile";
import socialLinksRouter from "./routes/social-links";
import aboutRouter from "./routes/about";

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
