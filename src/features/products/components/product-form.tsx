"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/src/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { upsertProduct } from "@/src/features/products/actions";
import {
  type ProductInput,
  productSchema,
} from "@/src/features/products/schemas";

export function ProductForm() {
  const [isPending, startTransition] = useTransition();
  const form = useForm<ProductInput>({
    resolver: zodResolver(productSchema),
    defaultValues: { name: "", sku: "", unit: "pcs" },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>New Product</CardTitle>
      </CardHeader>
      <CardContent>
        <form
          className="grid gap-3 md:grid-cols-4"
          onSubmit={form.handleSubmit((values) => {
            startTransition(async () => {
              const result = await upsertProduct(values);
              if (!result.success) {
                toast.error(result.message);
                return;
              }
              toast.success("Product saved");
              form.reset({ name: "", sku: "", unit: "pcs" });
            });
          })}
        >
          <div className="grid gap-2">
            <Label>Name</Label>
            <Input {...form.register("name")} />
          </div>
          <div className="grid gap-2">
            <Label>SKU</Label>
            <Input {...form.register("sku")} />
          </div>
          <div className="grid gap-2">
            <Label>Unit</Label>
            <Input {...form.register("unit")} />
          </div>
          <div className="flex items-end">
            <Button className="w-full" disabled={isPending} type="submit">
              Save
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
