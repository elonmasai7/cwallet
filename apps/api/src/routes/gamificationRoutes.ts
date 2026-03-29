import { Router } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { requireAuth } from "../middleware/auth";
import { leaderboard, userPoints } from "../controllers/gamificationController";

export const gamificationRouter = Router();

gamificationRouter.get("/leaderboard", asyncHandler(leaderboard));
gamificationRouter.get("/user/points", requireAuth, asyncHandler(userPoints));

