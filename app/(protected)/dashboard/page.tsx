import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { MovementChart } from "@/src/features/dashboard/components/movement-chart";
import { getDashboardAnalytics } from "@/src/features/dashboard/queries";

export default async function DashboardPage() {
  const analytics = await getDashboardAnalytics();

  return (
    <div className="grid gap-4">
      <div className="grid gap-4 md:grid-cols-3">
        {analytics.cards.map((card) => (
          <Card key={card.label}>
            <CardHeader>
              <CardTitle>{card.label}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold">{card.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Stock Movement Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <MovementChart data={analytics.chartData} />
        </CardContent>
      </Card>
    </div>
  );
}
