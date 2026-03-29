import { z } from "zod";

export const createLessonSchema = z.object({
  title: z.string().min(3),
  slug: z.string().min(3),
  summary: z.string().min(10),
  content: z.string().min(20),
  category: z.string().min(3),
  order: z.number().int().positive(),
  pointsAward: z.number().int().positive().default(10),
  quizzes: z.array(
    z.object({
      question: z.string().min(5),
      options: z.array(z.string().min(1)).min(2),
      answerIndex: z.number().int().min(0),
      explanation: z.string().optional(),
    }),
  ).min(1),
});

export const lessonIdSchema = z.object({
  id: z.string().cuid(),
});

