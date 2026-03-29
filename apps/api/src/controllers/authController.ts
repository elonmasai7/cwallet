import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { prisma } from "../lib/prisma";
import { loginUser, logoutUser, refreshUserToken, registerUser } from "../services/authService";

function sanitizeUser(user: {
  id: string;
  email: string;
  name: string;
  phone: string | null;
  role: string;
  pointsTotal: number;
  level: string;
}) {
  return user;
}

export async function register(req: Request, res: Response) {
  const result = await registerUser(req.body);

  res.status(StatusCodes.CREATED).json({
    user: sanitizeUser(result.user),
    accessToken: result.accessToken,
    refreshToken: result.refreshToken,
  });
}

export async function login(req: Request, res: Response) {
  const result = await loginUser(req.body.email, req.body.password);

  res.json({
    user: sanitizeUser(result.user),
    accessToken: result.accessToken,
    refreshToken: result.refreshToken,
  });
}

export async function refresh(req: Request, res: Response) {
  const result = await refreshUserToken(req.body.refreshToken);
  res.json(result);
}

export async function logout(req: Request, res: Response) {
  await logoutUser(req.body.refreshToken);
  res.status(StatusCodes.NO_CONTENT).send();
}

export async function me(req: Request, res: Response) {
  const user = await prisma.user.findUnique({
    where: { id: req.user!.userId },
    select: {
      id: true,
      email: true,
      name: true,
      phone: true,
      role: true,
      pointsTotal: true,
      level: true,
      createdAt: true,
    },
  });

  res.json(user);
}

