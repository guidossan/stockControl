import { CategoryModel } from "@/src/features/categories/model";
import { MovementModel } from "@/src/features/inventory/model";
import { ProductModel } from "@/src/features/products/model";
import { requireSession } from "@/src/lib/auth/guards";
import { connectToDatabase } from "@/src/lib/db/mongoose";

export async function getDashboardAnalytics() {
  const session = await requireSession();
  await connectToDatabase();

  const [products, categories, movements] = await Promise.all([
    ProductModel.countDocuments({ workspaceId: session.workspaceId }),
    CategoryModel.countDocuments({ workspaceId: session.workspaceId }),
    MovementModel.find({ workspaceId: session.workspaceId })
      .sort({ createdAt: -1 })
      .limit(30)
      .lean(),
  ]);

  const movementByDay = movements.reduce<Record<string, number>>(
    (acc, movement) => {
      const day = new Date(movement.createdAt).toISOString().slice(0, 10);
      const delta =
        movement.type === "IN" ? movement.quantity : -movement.quantity;
      acc[day] = (acc[day] ?? 0) + delta;
      return acc;
    },
    {},
  );

  const chartData = Object.entries(movementByDay)
    .map(([date, quantity]) => ({ date, quantity }))
    .sort((a, b) => a.date.localeCompare(b.date));

  return {
    cards: [
      { label: "Products", value: products },
      { label: "Categories", value: categories },
      { label: "Movements (30)", value: movements.length },
    ],
    chartData,
  };
}
