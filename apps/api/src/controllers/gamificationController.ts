import { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { getLeaderboard } from "../services/gamificationService";

export async function leaderboard(_req: Request, res: Response) {
  const data = await getLeaderboard();
  res.json(data);
}

export async function userPoints(req: Request, res: Response) {
  const user = await prisma.user.findUnique({
    where: { id: req.user!.userId },
    select: {
      pointsTotal: true,
      level: true,
      pointEvents: {
        orderBy: { createdAt: "desc" },
        take: 20,
      },
    },
  });

  res.json(user);
}

