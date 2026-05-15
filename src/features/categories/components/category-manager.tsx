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
import {
  deleteCategory,
  upsertCategory,
} from "@/src/features/categories/actions";
import {
  type CategoryInput,
  categorySchema,
} from "@/src/features/categories/schemas";

type CategoryListItem = {
  _id: string;
  name: string;
  description?: string;
};

export function CategoryManager({
  categories,
}: {
  categories: CategoryListItem[];
}) {
  const [isPending, startTransition] = useTransition();
  const form = useForm<CategoryInput>({
    resolver: zodResolver(categorySchema),
    defaultValues: { name: "", description: "" },
  });

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>New Category</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            className="grid gap-3"
            onSubmit={form.handleSubmit((values) => {
              startTransition(async () => {
                const result = await upsertCategory(values);
                if (!result.success) {
                  toast.error(result.message);
                  return;
                }
                toast.success("Category saved");
                form.reset({ name: "", description: "" });
              });
            })}
          >
            <div className="grid gap-2">
              <Label>Name</Label>
              <Input {...form.register("name")} />
            </div>
            <div className="grid gap-2">
              <Label>Description</Label>
              <Input {...form.register("description")} />
            </div>
            <Button disabled={isPending} type="submit">
              Save category
            </Button>
          </form>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Category List</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-2">
          {categories.map((category) => (
            <div
              key={category._id}
              className="flex items-center justify-between rounded border p-2"
            >
              <div>
                <p className="font-medium">{category.name}</p>
                <p className="text-xs text-zinc-500">{category.description}</p>
              </div>
              <Button
                type="button"
                variant="ghost"
                onClick={() => {
                  startTransition(async () => {
                    const result = await deleteCategory(category._id);
                    if (!result.success) {
                      toast.error(result.message);
                      return;
                    }
                    toast.success("Category removed");
                  });
                }}
              >
                Delete
              </Button>
            </div>
          ))}
          {categories.length === 0 ? (
            <p className="text-sm text-zinc-500">No categories yet.</p>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}
