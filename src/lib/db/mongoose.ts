import mongoose from "mongoose";
import { env } from "@/src/lib/env";

declare global {
  var mongooseCache:
    | { conn: typeof mongoose | null; promise: Promise<typeof mongoose> | null }
    | undefined;
}

const cache = global.mongooseCache ?? { conn: null, promise: null };
global.mongooseCache = cache;

export async function connectToDatabase() {
  if (cache.conn) return cache.conn;

  cache.promise ??= mongoose.connect(env.MONGODB_URI, {
    dbName: "stockflow",
    bufferCommands: false,
  });

  cache.conn = await cache.promise;
  return cache.conn;
}
