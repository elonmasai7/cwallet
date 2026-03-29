import { z } from "zod";

export const completeLessonSchema = z.object({
  lessonId: z.string().cuid(),
  answers: z.array(z.number().int().min(0)).min(1),
});

