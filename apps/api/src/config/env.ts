import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const isTest = process.env.NODE_ENV === "test";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().default(4000),
  DATABASE_URL: z.string().min(1).default("postgresql://postgres:postgres@localhost:5432/civicwallet_test?schema=public"),
  JWT_ACCESS_SECRET: z.string().min(16).default("test-access-secret-123456"),
  JWT_REFRESH_SECRET: z.string().min(16).default("test-refresh-secret-123456"),
  JWT_ACCESS_EXPIRES_IN: z.string().default("15m"),
  JWT_REFRESH_EXPIRES_IN: z.string().default("7d"),
  CORS_ORIGIN: z.string().default("http://localhost:3000,http://localhost:8081"),
  CLOUDINARY_CLOUD_NAME: z.string().optional(),
  CLOUDINARY_API_KEY: z.string().optional(),
  CLOUDINARY_API_SECRET: z.string().optional(),
  AFRICASTALKING_USERNAME: z.string().default("sandbox"),
  AFRICASTALKING_API_KEY: z.string().optional(),
  AFRICASTALKING_SMS_FROM: z.string().default("CivicWallet"),
});

const parsedEnv = envSchema.parse({
  ...process.env,
  DATABASE_URL: process.env.DATABASE_URL || (isTest ? "postgresql://postgres:postgres@localhost:5432/civicwallet_test?schema=public" : process.env.DATABASE_URL),
  JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET || (isTest ? "test-access-secret-123456" : process.env.JWT_ACCESS_SECRET),
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || (isTest ? "test-refresh-secret-123456" : process.env.JWT_REFRESH_SECRET),
});

export const env = parsedEnv;
export const corsOrigins = env.CORS_ORIGIN.split(",").map((origin) => origin.trim());
