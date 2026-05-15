"use server";

import { Types } from "mongoose";
import { revalidatePath } from "next/cache";
import { CategoryModel } from "@/src/features/categories/model";
import { MovementModel } from "@/src/features/inventory/model";
import { ProductModel } from "@/src/features/products/model";
import {
  type MovementInput,
  movementSchema,
  type ProductInput,
  productSchema,
} from "@/src/features/products/schemas";
import { canManageCatalog, requireSession } from "@/src/lib/auth/guards";
import { isMongoDuplicateKeyError } from "@/src/lib/db/errors";
import { connectToDatabase } from "@/src/lib/db/mongoose";
import type { ActionResult } from "@/src/types/common";

function duplicateSkuResult(error: unknown): ActionResult | null {
  if (!isMongoDuplicateKeyError(error)) return null;
  return {
    success: false,
    message: "SKU already exists in this workspace",
  };
}

export async function listProducts(search?: string) {
  const session = await requireSession();
  await connectToDatabase();

  const query = {
    workspaceId: session.workspaceId,
    ...(search ? { name: { $regex: search, $options: "i" } } : {}),
  };

  const products = await ProductModel.find(query).lean();
  const categories = await CategoryModel.find({
    workspaceId: session.workspaceId,
  }).lean();
  const stockAggregation = await MovementModel.aggregate([
    { $match: { workspaceId: session.workspaceId } },
    {
      $group: {
        _id: "$productId",
        stock: {
          $sum: {
            $cond: [
              { $eq: ["$type", "IN"] },
              "$quantity",
              { $multiply: ["$quantity", -1] },
            ],
          },
        },
      },
    },
  ]);

  const stockMap = new Map(
    stockAggregation.map((item) => [item._id.toString(), item.stock as number]),
  );
  const categoryMap = new Map(
    categories.map((item) => [item._id.toString(), item.name as string]),
  );

  return products.map((product) => ({
    id: product._id.toString(),
    name: product.name,
    sku: product.sku,
    unit: product.unit,
    categoryId: product.categoryId?.toString(),
    categoryName: product.categoryId
      ? (categoryMap.get(product.categoryId.toString()) ?? "-")
      : "-",
    stock: stockMap.get(product._id.toString()) ?? 0,
  }));
}

export async function listProductOptions() {
  const session = await requireSession();
  await connectToDatabase();
  return ProductModel.find({ workspaceId: session.workspaceId })
    .select("name")
    .lean();
}

export async function upsertProduct(
  input: ProductInput,
): Promise<ActionResult> {
  const session = await requireSession();
  if (!canManageCatalog(session.role))
    return { success: false, message: "Not authorized" };

  const parsed = productSchema.safeParse(input);
  if (!parsed.success)
    return {
      success: false,
      message: parsed.error.issues[0]?.message ?? "Invalid input",
    };

  await connectToDatabase();

  const payload = {
    workspaceId: session.workspaceId,
    name: parsed.data.name,
    sku: parsed.data.sku,
    categoryId: parsed.data.categoryId
      ? new Types.ObjectId(parsed.data.categoryId)
      : undefined,
    unit: parsed.data.unit,
  };

  if (parsed.data.id) {
    try {
      await ProductModel.findOneAndUpdate(
        { _id: parsed.data.id, workspaceId: session.workspaceId },
        payload,
      );
    } catch (error) {
      const duplicateError = duplicateSkuResult(error);
      if (duplicateError) return duplicateError;
      throw error;
    }
  } else {
    try {
      await ProductModel.create(payload);
    } catch (error) {
      const duplicateError = duplicateSkuResult(error);
      if (duplicateError) return duplicateError;
      throw error;
    }
  }

  revalidatePath("/products");
  revalidatePath("/dashboard");
  return { success: true };
}

export async function deleteProduct(id: string): Promise<ActionResult> {
  const session = await requireSession();
  if (!canManageCatalog(session.role))
    return { success: false, message: "Not authorized" };

  await connectToDatabase();
  await ProductModel.findOneAndDelete({
    _id: id,
    workspaceId: session.workspaceId,
  });
  revalidatePath("/products");
  return { success: true };
}

export async function createMovement(
  input: MovementInput,
): Promise<ActionResult> {
  const session = await requireSession();
  const parsed = movementSchema.safeParse(input);
  if (!parsed.success)
    return {
      success: false,
      message: parsed.error.issues[0]?.message ?? "Invalid input",
    };

  await connectToDatabase();

  const product = await ProductModel.findOne({
    _id: parsed.data.productId,
    workspaceId: session.workspaceId,
  }).lean();
  if (!product) return { success: false, message: "Product not found" };

  if (parsed.data.type === "OUT") {
    const [stockData] = await MovementModel.aggregate([
      {
        $match: {
          workspaceId: session.workspaceId,
          productId: new Types.ObjectId(parsed.data.productId),
        },
      },
      {
        $group: {
          _id: "$productId",
          stock: {
            $sum: {
              $cond: [
                { $eq: ["$type", "IN"] },
                "$quantity",
                { $multiply: ["$quantity", -1] },
              ],
            },
          },
        },
      },
    ]);
    const currentStock = (stockData?.stock as number | undefined) ?? 0;
    if (currentStock < parsed.data.quantity) {
      return { success: false, message: "Insufficient stock for OUT movement" };
    }
  }

  await MovementModel.create({
    workspaceId: session.workspaceId,
    productId: new Types.ObjectId(parsed.data.productId),
    type: parsed.data.type,
    quantity: parsed.data.quantity,
    note: parsed.data.note ?? "",
  });

  revalidatePath("/products");
  revalidatePath("/dashboard");
  revalidatePath("/movements");
  return { success: true };
}

export async function listMovements() {
  const session = await requireSession();
  await connectToDatabase();

  const movements = await MovementModel.find({
    workspaceId: session.workspaceId,
  })
    .sort({ createdAt: -1 })
    .limit(20)
    .populate("productId", "name")
    .lean();

  return movements.map((movement) => ({
    id: movement._id.toString(),
    type: movement.type,
    quantity: movement.quantity,
    note: movement.note,
    productName: (movement.productId as { name?: string })?.name ?? "Unknown",
    createdAt: movement.createdAt,
  }));
}
