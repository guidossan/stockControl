"use server";

import { revalidatePath } from "next/cache";
import { CategoryModel } from "@/src/features/categories/model";
import {
  type CategoryInput,
  categorySchema,
} from "@/src/features/categories/schemas";
import { requireSession } from "@/src/lib/auth/guards";
import { connectToDatabase } from "@/src/lib/db/mongoose";
import type { ActionResult } from "@/src/types/common";

export async function listCategories() {
  const session = await requireSession();
  await connectToDatabase();
  return CategoryModel.find({ workspaceId: session.workspaceId })
    .sort({ createdAt: -1 })
    .lean();
}

export async function upsertCategory(
  input: CategoryInput,
): Promise<ActionResult> {
  const session = await requireSession();
  const parsed = categorySchema.safeParse(input);
  if (!parsed.success)
    return {
      success: false,
      message: parsed.error.issues[0]?.message ?? "Invalid input",
    };

  await connectToDatabase();
  if (parsed.data.id) {
    await CategoryModel.findOneAndUpdate(
      { _id: parsed.data.id, workspaceId: session.workspaceId },
      { name: parsed.data.name, description: parsed.data.description ?? "" },
    );
  } else {
    await CategoryModel.create({
      workspaceId: session.workspaceId,
      name: parsed.data.name,
      description: parsed.data.description ?? "",
    });
  }

  revalidatePath("/categories");
  revalidatePath("/products");
  return { success: true };
}

export async function deleteCategory(id: string): Promise<ActionResult> {
  const session = await requireSession();
  await connectToDatabase();
  await CategoryModel.findOneAndDelete({
    _id: id,
    workspaceId: session.workspaceId,
  });
  revalidatePath("/categories");
  return { success: true };
}
