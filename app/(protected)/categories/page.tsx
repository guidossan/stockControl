import { listCategories } from "@/src/features/categories/actions";
import { CategoryManager } from "@/src/features/categories/components/category-manager";

export default async function CategoriesPage() {
  const categories = await listCategories();

  return (
    <div className="grid gap-4">
      <h2 className="text-lg font-semibold">Categories</h2>
      <CategoryManager
        categories={categories.map((category) => ({
          _id: category._id.toString(),
          name: category.name,
          description: category.description,
        }))}
      />
    </div>
  );
}
