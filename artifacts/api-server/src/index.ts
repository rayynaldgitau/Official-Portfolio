import { Router, type IRouter } from "express";
import healthRouter from "./health";
import messagesRouter from "./messages";
import storageRouter from "./storage";
import syncRouter from "./sync";
import projectsRouter from "./projects";
import skillsRouter from "./skills";
import experienceRouter from "./experience";
import certificationsRouter from "./certifications";
import profileRouter from "./profile";
import socialLinksRouter from "./social-links";
import aboutRouter from "./about";

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