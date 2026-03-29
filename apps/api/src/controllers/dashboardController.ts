import { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { getPublicFinanceSnapshot } from "../services/dashboardService";

export async function publicFinance(_req: Request, res: Response) {
  res.setHeader("Cache-Control", "public, max-age=300");
  res.json(getPublicFinanceSnapshot());
}

export async function notifications(req: Request, res: Response) {
  const notifications = await prisma.notification.findMany({
    where: { userId: req.user!.userId },
    orderBy: { createdAt: "desc" },
    take: 20,
  });

  res.json(notifications);
}
