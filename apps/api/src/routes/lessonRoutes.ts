import { Router } from "express";
import { Role } from "@prisma/client";
import { asyncHandler } from "../utils/asyncHandler";
import { requireAuth, requireRole } from "../middleware/auth";
import { validate } from "../middleware/validate";
import { getLesson, getLessons, postLesson } from "../controllers/lessonController";
import { createLessonSchema, lessonIdSchema } from "../validators/lessonValidators";

export const lessonRouter = Router();

lessonRouter.get("/", asyncHandler(getLessons));
lessonRouter.get("/:id", validate({ params: lessonIdSchema }), asyncHandler(getLesson));
lessonRouter.post(
  "/",
  requireAuth,
  requireRole(Role.ADMIN),
  validate({ body: createLessonSchema }),
  asyncHandler(postLesson),
);

