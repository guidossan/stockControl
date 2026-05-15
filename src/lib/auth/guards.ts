import { redirect } from "next/navigation";
import { getSession, type UserRole } from "@/src/lib/auth/session";

export async function requireSession() {
  const session = await getSession();
  if (!session) redirect("/login");
  return session;
}

export function canManageCatalog(role: UserRole) {
  return role === "OWNER" || role === "ADMIN";
}
