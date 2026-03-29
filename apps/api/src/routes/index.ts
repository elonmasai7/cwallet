import { Router } from "express";
import { authRouter } from "./authRoutes";
import { lessonRouter } from "./lessonRoutes";
import { progressRouter } from "./progressRoutes";
import { reportRouter } from "./reportRoutes";
import { gamificationRouter } from "./gamificationRoutes";
import { dashboardRouter } from "./dashboardRoutes";
import { smsRouter } from "./smsRoutes";

export const apiRouter = Router();

apiRouter.use("/auth", authRouter);
apiRouter.use("/lessons", lessonRouter);
apiRouter.use("/progress", progressRouter);
apiRouter.use("/reports", reportRouter);
apiRouter.use("/", gamificationRouter);
apiRouter.use("/", dashboardRouter);
apiRouter.use("/", smsRouter);

