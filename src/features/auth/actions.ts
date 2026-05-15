"use server";

import crypto from "node:crypto";
import { redirect } from "next/navigation";
import { UserModel } from "@/src/features/auth/model";
import {
  type LoginInput,
  loginSchema,
  type RegisterInput,
  registerSchema,
} from "@/src/features/auth/schemas";
import { clearSession, setSession } from "@/src/lib/auth/session";
import { connectToDatabase } from "@/src/lib/db/mongoose";
import type { ActionResult } from "@/src/types/common";

function hashPassword(password: string) {
  return crypto.scryptSync(password, "stockflow", 64).toString("hex");
}

export async function registerAction(
  input: RegisterInput,
): Promise<ActionResult> {
  const parsed = registerSchema.safeParse(input);
  if (!parsed.success)
    return {
      success: false,
      message: parsed.error.issues[0]?.message ?? "Invalid input",
    };

  await connectToDatabase();
  const exists = await UserModel.findOne({ email: parsed.data.email }).lean();
  if (exists) return { success: false, message: "Email already in use" };

  const user = await UserModel.create({
    ...parsed.data,
    passwordHash: hashPassword(parsed.data.password),
  });

  await setSession({
    userId: user._id.toString(),
    email: user.email,
    role: user.role,
    workspaceId: user.workspaceId,
  });

  return { success: true };
}

export async function loginAction(input: LoginInput): Promise<ActionResult> {
  const parsed = loginSchema.safeParse(input);
  if (!parsed.success)
    return {
      success: false,
      message: parsed.error.issues[0]?.message ?? "Invalid input",
    };

  await connectToDatabase();
  const user = await UserModel.findOne({ email: parsed.data.email });
  if (!user) return { success: false, message: "Invalid credentials" };

  if (user.passwordHash !== hashPassword(parsed.data.password)) {
    return { success: false, message: "Invalid credentials" };
  }

  await setSession({
    userId: user._id.toString(),
    email: user.email,
    role: user.role,
    workspaceId: user.workspaceId,
  });

  return { success: true };
}

export async function logoutAction() {
  await clearSession();
  redirect("/login");
}
