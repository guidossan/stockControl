import crypto from "node:crypto";
import { cookies } from "next/headers";
import { env } from "@/src/lib/env";

const SESSION_COOKIE = "stockflow_session";
const SESSION_MAX_AGE = 60 * 60 * 24 * 7;

export type UserRole = "OWNER" | "ADMIN" | "EMPLOYEE";

export type SessionPayload = {
  userId: string;
  email: string;
  workspaceId: string;
  role: UserRole;
};

function sign(data: string) {
  return crypto
    .createHmac("sha256", env.SESSION_SECRET)
    .update(data)
    .digest("hex");
}

export async function setSession(payload: SessionPayload) {
  const raw = JSON.stringify(payload);
  const encoded = Buffer.from(raw).toString("base64url");
  const token = `${encoded}.${sign(encoded)}`;

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });
}

export async function clearSession() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}

export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return null;

  const [encoded, hash] = token.split(".");
  if (!encoded || !hash || sign(encoded) !== hash) return null;

  try {
    const payload = JSON.parse(
      Buffer.from(encoded, "base64url").toString("utf-8"),
    ) as SessionPayload;
    if (!payload.workspaceId || !payload.role || !payload.userId) return null;
    return payload;
  } catch {
    return null;
  }
}
