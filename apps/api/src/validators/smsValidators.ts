import { z } from "zod";

export const smsWebhookSchema = z.object({
  from: z.string().min(5),
  text: z.string().min(1),
});

