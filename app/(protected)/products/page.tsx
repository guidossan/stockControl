import { listProducts } from "@/src/features/products/actions";
import { ProductForm } from "@/src/features/products/components/product-form";
import { ProductsTable } from "@/src/features/products/components/products-table";

export default async function ProductsPage() {
  const products = await listProducts();

  return (
    <div className="grid gap-4">
      <h2 className="text-lg font-semibold">Products</h2>
      <ProductForm />
      <ProductsTable products={products} />
    </div>
  );
}
