"use client";

import { useQueryState } from "nuqs";
import { useMemo, useTransition } from "react";
import { toast } from "sonner";
import { Badge } from "@/src/components/ui/badge";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/src/components/ui/table";
import { deleteProduct } from "@/src/features/products/actions";

type ProductRow = {
  id: string;
  name: string;
  sku: string;
  unit: string;
  categoryName: string;
  stock: number;
};

export function ProductsTable({ products }: { products: ProductRow[] }) {
  const [isPending, startTransition] = useTransition();
  const [q, setQ] = useQueryState("q", { defaultValue: "" });

  const filtered = useMemo(() => {
    if (!q) return products;
    const keyword = q.toLowerCase();
    return products.filter(
      (product) =>
        product.name.toLowerCase().includes(keyword) ||
        product.sku.toLowerCase().includes(keyword),
    );
  }, [products, q]);

  return (
    <div className="space-y-3">
      <Input
        placeholder="Search products..."
        value={q}
        onChange={(event) => setQ(event.target.value)}
      />
      <div className="rounded-lg border border-zinc-200 dark:border-zinc-800">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>SKU</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((product) => (
              <TableRow key={product.id}>
                <TableCell>{product.name}</TableCell>
                <TableCell>{product.sku}</TableCell>
                <TableCell>{product.categoryName}</TableCell>
                <TableCell>
                  <Badge
                    className={
                      product.stock < 1 ? "border-red-500 text-red-600" : ""
                    }
                  >
                    {product.stock} {product.unit}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Button
                    disabled={isPending}
                    type="button"
                    variant="ghost"
                    onClick={() => {
                      startTransition(async () => {
                        const result = await deleteProduct(product.id);
                        if (!result.success) {
                          toast.error(result.message);
                          return;
                        }
                        toast.success("Product deleted");
                      });
                    }}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
