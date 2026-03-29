import { z } from "zod";

export const createReportSchema = z.object({
  title: z.string().min(3).max(120),
  description: z.string().min(10).max(1000),
  latitude: z.coerce.number().min(-90).max(90).optional(),
  longitude: z.coerce.number().min(-180).max(180).optional(),
  location: z.string().max(255).optional(),
});

export const updateReportSchema = z.object({
  status: z.enum(["PENDING", "APPROVED", "REJECTED", "RESOLVED"]),
});

export const reportIdSchema = z.object({
  id: z.string().cuid(),
});

