import { z } from "zod";

export const productSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2),
  sku: z.string().min(2),
  categoryId: z.string().optional(),
  unit: z.string().default("pcs"),
});

export const movementSchema = z.object({
  productId: z.string().min(1),
  type: z.enum(["IN", "OUT"]),
  quantity: z.coerce.number().int().positive(),
  note: z.string().optional(),
});

export type ProductInput = z.input<typeof productSchema>;
export type MovementInput = z.input<typeof movementSchema>;
