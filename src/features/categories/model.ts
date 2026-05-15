import { type InferSchemaType, model, models, Schema } from "mongoose";

const categorySchema = new Schema(
  {
    workspaceId: { type: String, required: true, index: true },
    name: { type: String, required: true },
    description: { type: String },
  },
  { timestamps: true },
);

export type CategoryDocument = InferSchemaType<typeof categorySchema>;
export const CategoryModel =
  models.Category || model("Category", categorySchema);
