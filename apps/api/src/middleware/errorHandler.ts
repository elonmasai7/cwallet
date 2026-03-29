import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { Prisma } from "@prisma/client";
import { StatusCodes } from "http-status-codes";
import { HttpError } from "../lib/httpError";

export function notFoundHandler(_req: Request, res: Response) {
  res.status(StatusCodes.NOT_FOUND).json({ message: "Route not found" });
}

export function errorHandler(
  error: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
) {
  if (error instanceof ZodError) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: "Validation failed",
      issues: error.flatten(),
    });
  }

  if (error instanceof HttpError) {
    return res.status(error.statusCode).json({ message: error.message });
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: "Database request failed",
      code: error.code,
    });
  }

  console.error(error);
  return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
    message: "Something went wrong",
  });
}

