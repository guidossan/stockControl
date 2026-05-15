"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { createMovement } from "@/src/features/products/actions";
import {
  type MovementInput,
  movementSchema,
} from "@/src/features/products/schemas";

type ProductOption = { _id: string; name: string };

export function MovementForm({ products }: { products: ProductOption[] }) {
  const [isPending, startTransition] = useTransition();
  const form = useForm<MovementInput>({
    resolver: zodResolver(movementSchema),
    defaultValues: { type: "IN", quantity: 1, productId: "" },
  });

  return (
    <form
      className="grid gap-3 md:grid-cols-4"
      onSubmit={form.handleSubmit((values) => {
        startTransition(async () => {
          const result = await createMovement(values);
          if (!result.success) {
            toast.error(result.message);
            return;
          }
          toast.success("Movement added");
          form.reset({ type: "IN", quantity: 1, productId: "" });
        });
      })}
    >
      <div className="grid gap-2">
        <Label>Product</Label>
        <select
          className="h-10 rounded-md border border-zinc-300 bg-transparent px-3 text-sm dark:border-zinc-700"
          {...form.register("productId")}
        >
          <option value="">Select product</option>
          {products.map((product) => (
            <option key={product._id} value={product._id}>
              {product.name}
            </option>
          ))}
        </select>
      </div>
      <div className="grid gap-2">
        <Label>Type</Label>
        <select
          className="h-10 rounded-md border border-zinc-300 bg-transparent px-3 text-sm dark:border-zinc-700"
          {...form.register("type")}
        >
          <option value="IN">IN</option>
          <option value="OUT">OUT</option>
        </select>
      </div>
      <div className="grid gap-2">
        <Label>Quantity</Label>
        <Input type="number" min={1} {...form.register("quantity")} />
      </div>
      <div className="flex items-end">
        <Button className="w-full" disabled={isPending} type="submit">
          Add movement
        </Button>
      </div>
    </form>
  );
}
