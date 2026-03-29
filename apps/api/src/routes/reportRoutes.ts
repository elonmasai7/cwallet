import { Router } from "express";
import { Role } from "@prisma/client";
import { asyncHandler } from "../utils/asyncHandler";
import { requireAuth, requireRole } from "../middleware/auth";
import { validate } from "../middleware/validate";
import { upload } from "../middleware/upload";
import { getReports, patchReport, postReport } from "../controllers/reportController";
import { paginationSchema } from "../validators/commonValidators";
import {
  createReportSchema,
  reportIdSchema,
  updateReportSchema,
} from "../validators/reportValidators";

export const reportRouter = Router();

reportRouter.use(requireAuth);
reportRouter.post("/", upload.single("image"), validate({ body: createReportSchema }), asyncHandler(postReport));
reportRouter.get("/", validate({ query: paginationSchema }), asyncHandler(getReports));
reportRouter.patch(
  "/:id",
  requireRole(Role.ADMIN),
  validate({ params: reportIdSchema, body: updateReportSchema }),
  asyncHandler(patchReport),
);

