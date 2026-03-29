import { StatusCodes } from "http-status-codes";
import { prisma } from "../lib/prisma";
import { HttpError } from "../lib/httpError";
import { comparePassword, hashPassword } from "../utils/password";
import {
  compareToken,
  hashToken,
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from "../utils/jwt";

function getRefreshExpiryDate() {
  return new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
}

async function issueTokens(user: { id: string; role: string }) {
  const accessToken = signAccessToken({ userId: user.id, role: user.role });
  const refreshToken = signRefreshToken({ userId: user.id, role: user.role });

  await prisma.refreshToken.create({
    data: {
      userId: user.id,
      tokenHash: await hashToken(refreshToken),
      expiresAt: getRefreshExpiryDate(),
    },
  });

  return { accessToken, refreshToken };
}

export async function registerUser(data: {
  name: string;
  email: string;
  password: string;
  phone?: string;
}) {
  const existingUser = await prisma.user.findFirst({
    where: {
      OR: [{ email: data.email }, ...(data.phone ? [{ phone: data.phone }] : [])],
    },
  });

  if (existingUser) {
    throw new HttpError(StatusCodes.CONFLICT, "A user with these credentials already exists");
  }

  const user = await prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      phone: data.phone,
      passwordHash: await hashPassword(data.password),
    },
  });

  const tokens = await issueTokens({ id: user.id, role: user.role });

  return { user, ...tokens };
}

export async function loginUser(email: string, password: string) {
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user || !(await comparePassword(password, user.passwordHash))) {
    throw new HttpError(StatusCodes.UNAUTHORIZED, "Invalid email or password");
  }

  const tokens = await issueTokens({ id: user.id, role: user.role });
  return { user, ...tokens };
}

export async function refreshUserToken(refreshToken: string) {
  const payload = verifyRefreshToken(refreshToken);
  const savedTokens = await prisma.refreshToken.findMany({
    where: {
      userId: payload.userId,
      expiresAt: {
        gt: new Date(),
      },
    },
  });

  const matchingToken = await Promise.all(
    savedTokens.map(async (tokenRecord) => ({
      tokenRecord,
      matches: await compareToken(refreshToken, tokenRecord.tokenHash),
    })),
  );

  const validToken = matchingToken.find((entry) => entry.matches)?.tokenRecord;

  if (!validToken) {
    throw new HttpError(StatusCodes.UNAUTHORIZED, "Refresh token is invalid");
  }

  await prisma.refreshToken.delete({ where: { id: validToken.id } });

  return issueTokens({ id: payload.userId, role: payload.role });
}

export async function logoutUser(refreshToken: string) {
  const payload = verifyRefreshToken(refreshToken);
  const tokens = await prisma.refreshToken.findMany({
    where: { userId: payload.userId },
  });

  for (const token of tokens) {
    if (await compareToken(refreshToken, token.tokenHash)) {
      await prisma.refreshToken.delete({ where: { id: token.id } });
      break;
    }
  }
}
