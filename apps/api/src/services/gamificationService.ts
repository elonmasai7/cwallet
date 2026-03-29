import { prisma } from "../lib/prisma";
import { resolveLevel } from "../utils/gamification";

export async function awardPoints(userId: string, points: number, reason: string) {
  const user = await prisma.user.update({
    where: { id: userId },
    data: {
      pointsTotal: {
        increment: points,
      },
    },
  });

  const level = resolveLevel(user.pointsTotal);

  await prisma.$transaction([
    prisma.pointEvent.create({
      data: {
        userId,
        points,
        reason,
      },
    }),
    prisma.user.update({
      where: { id: userId },
      data: { level },
    }),
  ]);

  return {
    totalPoints: user.pointsTotal,
    level,
  };
}

export async function getLeaderboard(limit = 10) {
  return prisma.user.findMany({
    orderBy: [{ pointsTotal: "desc" }, { createdAt: "asc" }],
    take: limit,
    select: {
      id: true,
      name: true,
      pointsTotal: true,
      level: true,
    },
  });
}

