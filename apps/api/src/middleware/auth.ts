import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { Role } from "@prisma/client";
import { HttpError } from "../lib/httpError";
import { verifyAccessToken } from "../utils/jwt";

export function requireAuth(req: Request, _res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith("Bearer ") ? authHeader.split(" ")[1] : undefined;

  if (!token) {
    return next(new HttpError(StatusCodes.UNAUTHORIZED, "Authentication required"));
  }

  try {
    const payload = verifyAccessToken(token);
    req.user = {
      userId: payload.userId,
      role: payload.role as Role,
    };
    next();
  } catch {
    next(new HttpError(StatusCodes.UNAUTHORIZED, "Invalid or expired token"));
  }
}

export function requireRole(role: Role) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user || req.user.role !== role) {
      return next(new HttpError(StatusCodes.FORBIDDEN, "Insufficient permissions"));
    }

    next();
  };
}

