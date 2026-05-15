import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
  MONGODB_URI: z
    .string()
    .url()
    .or(z.string().startsWith("mongodb://"))
    .default("mongodb://127.0.0.1:27017/stockflow"),
  SESSION_SECRET: z.string().min(16).default("dev-session-secret-1234"),
});

export const env = envSchema.parse({
  NODE_ENV: process.env.NODE_ENV,
  MONGODB_URI: process.env.MONGODB_URI,
  SESSION_SECRET: process.env.SESSION_SECRET,
});

export type Env = z.infer<typeof envSchema>;
