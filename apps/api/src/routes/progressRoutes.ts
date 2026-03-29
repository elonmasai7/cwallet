import { Router } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { requireAuth } from "../middleware/auth";
import { validate } from "../middleware/validate";
import { complete, getProgress } from "../controllers/progressController";
import { completeLessonSchema } from "../validators/progressValidators";

export const progressRouter = Router();

progressRouter.use(requireAuth);
progressRouter.get("/", asyncHandler(getProgress));
progressRouter.post("/complete", validate({ body: completeLessonSchema }), asyncHandler(complete));

