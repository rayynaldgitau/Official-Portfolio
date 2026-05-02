import { Router, type IRouter } from "express";
import healthRouter from "./health";
import messagesRouter from "./messages";
import storageRouter from "./storage";

const router: IRouter = Router();

router.use(healthRouter);
router.use(messagesRouter);
router.use(storageRouter);

export default router;
