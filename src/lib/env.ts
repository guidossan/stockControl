import { z } from "zod";

const NODE_ENV = z
  .enum(["development", "test", "production"])
  .default("development")
  .parse(process.env.NODE_ENV);
const IS_PRODUCTION_BUILD = process.env.NEXT_PHASE === "phase-production-build";
const SESSION_SECRET =
  process.env.SESSION_SECRET ??
  (NODE_ENV === "production" && !IS_PRODUCTION_BUILD
    ? ""
    : "dev-session-secret-1234");

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]),
  MONGODB_URI: z
    .string()
    .refine(
      (value) =>
        value.startsWith("mongodb://") || value.startsWith("mongodb+srv://"),
      "MONGODB_URI must start with mongodb:// or mongodb+srv://",
    )
    .default("mongodb://127.0.0.1:27017/stockflow"),
  SESSION_SECRET: z
    .string()
    .min(16, "SESSION_SECRET must be set with at least 16 characters"),
});

export const env = envSchema.parse({
  NODE_ENV,
  MONGODB_URI: process.env.MONGODB_URI,
  SESSION_SECRET,
});

export type Env = z.infer<typeof envSchema>;
