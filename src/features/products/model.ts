import { type InferSchemaType, model, models, Schema } from "mongoose";

const productSchema = new Schema(
  {
    workspaceId: { type: String, required: true, index: true },
    name: { type: String, required: true },
    sku: { type: String, required: true },
    categoryId: { type: Schema.Types.ObjectId, ref: "Category" },
    unit: { type: String, default: "pcs" },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

productSchema.index({ workspaceId: 1, sku: 1 }, { unique: true });

export type ProductDocument = InferSchemaType<typeof productSchema>;
export const ProductModel = models.Product || model("Product", productSchema);
