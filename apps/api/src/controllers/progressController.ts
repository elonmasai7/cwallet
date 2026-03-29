import { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { completeLesson } from "../services/lessonService";

export async function complete(req: Request, res: Response) {
  const result = await completeLesson(req.user!.userId, req.body.lessonId, req.body.answers);
  res.json(result);
}

export async function getProgress(req: Request, res: Response) {
  const progress = await prisma.progress.findMany({
    where: { userId: req.user!.userId },
    include: {
      lesson: {
        select: {
          id: true,
          title: true,
          category: true,
          order: true,
        },
      },
    },
    orderBy: { completedAt: "desc" },
  });

  res.json(progress);
}

