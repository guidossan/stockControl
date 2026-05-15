import { type InferSchemaType, model, models, Schema } from "mongoose";

const movementSchema = new Schema(
  {
    workspaceId: { type: String, required: true, index: true },
    productId: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
      index: true,
    },
    type: { type: String, enum: ["IN", "OUT"], required: true },
    quantity: { type: Number, required: true, min: 1 },
    note: { type: String },
  },
  { timestamps: true },
);

export type MovementDocument = InferSchemaType<typeof movementSchema>;
export const MovementModel =
  models.Movement || model("Movement", movementSchema);
