import { Request, Response } from "express";
import { ReportStatus } from "@prisma/client";
import { StatusCodes } from "http-status-codes";
import { getPagination } from "../utils/pagination";
import { createReport, listReports, updateReportStatus } from "../services/reportService";

export async function postReport(req: Request, res: Response) {
  const result = await createReport(req.user!.userId, req.body, req.file);
  res.status(StatusCodes.CREATED).json(result);
}

export async function getReports(req: Request, res: Response) {
  const { page, pageSize } = getPagination(Number(req.query.page), Number(req.query.pageSize));
  const reports = await listReports(req.user!.userId, req.user!.role, page, pageSize);
  res.json(reports);
}

export async function patchReport(req: Request, res: Response) {
  const report = await updateReportStatus(req.params.id, req.body.status as ReportStatus);
  res.json(report);
}

