import { Router } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { requireAuth } from "../middleware/auth";
import { notifications, publicFinance } from "../controllers/dashboardController";

export const dashboardRouter = Router();

dashboardRouter.get("/dashboard/public-finance", asyncHandler(publicFinance));
dashboardRouter.get("/notifications", requireAuth, asyncHandler(notifications));

