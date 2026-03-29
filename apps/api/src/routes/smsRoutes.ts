import { Router } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { validate } from "../middleware/validate";
import { webhook } from "../controllers/smsController";
import { smsWebhookSchema } from "../validators/smsValidators";

export const smsRouter = Router();

smsRouter.post("/sms/webhook", validate({ body: smsWebhookSchema }), asyncHandler(webhook));

