import fs from "fs/promises";
import { ReportStatus } from "@prisma/client";
import { StatusCodes } from "http-status-codes";
import { prisma } from "../lib/prisma";
import { HttpError } from "../lib/httpError";
import { uploadImage } from "../lib/cloudinary";
import { awardPoints } from "./gamificationService";
import { createNotification } from "./notificationService";

export async function createReport(
  userId: string,
  data: {
    title: string;
    description: string;
    latitude?: number;
    longitude?: number;
    location?: string;
  },
  file?: Express.Multer.File,
  source = "web",
) {
  let imageUrl: string | undefined;

  if (file) {
    const uploaded = await uploadImage(file.path);
    imageUrl = uploaded.secure_url;
    await fs.unlink(file.path).catch(() => undefined);
  }

  const report = await prisma.report.create({
    data: {
      userId,
      title: data.title,
      description: data.description,
      latitude: data.latitude,
      longitude: data.longitude,
      location: data.location,
      imageUrl,
      source,
    },
  });

  const gamification = await awardPoints(userId, 20, `Submitted report: ${data.title}`);
  await createNotification(userId, "Report submitted", "Your report is now pending admin review.");

  return { report, gamification };
}

export async function listReports(userId: string, role: string, page: number, pageSize: number) {
  const where = role === "ADMIN" ? {} : { userId };

  const [items, total] = await Promise.all([
    prisma.report.findMany({
      where,
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
      },
    }),
    prisma.report.count({ where }),
  ]);

  return { items, total, page, pageSize };
}

export async function updateReportStatus(reportId: string, status: ReportStatus) {
  const report = await prisma.report.findUnique({
    where: { id: reportId },
    include: { user: true },
  });

  if (!report) {
    throw new HttpError(StatusCodes.NOT_FOUND, "Report not found");
  }

  const updatedReport = await prisma.report.update({
    where: { id: reportId },
    data: { status },
  });

  await createNotification(
    report.userId,
    "Report updated",
    `Your report "${report.title}" is now ${status.toLowerCase()}.`,
  );

  return updatedReport;
}

