import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/src/components/ui/table";
import { MovementForm } from "@/src/features/inventory/components/movement-form";
import {
  listMovements,
  listProductOptions,
} from "@/src/features/products/actions";

export default async function MovementsPage() {
  const [products, movements] = await Promise.all([
    listProductOptions(),
    listMovements(),
  ]);

  return (
    <div className="grid gap-4">
      <h2 className="text-lg font-semibold">Inventory Movements</h2>
      <Card>
        <CardHeader>
          <CardTitle>Add movement</CardTitle>
        </CardHeader>
        <CardContent>
          <MovementForm
            products={products.map((product) => ({
              _id: product._id.toString(),
              name: product.name,
            }))}
          />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Recent movements</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {movements.map((movement) => (
                <TableRow key={movement.id}>
                  <TableCell>{movement.productName}</TableCell>
                  <TableCell>{movement.type}</TableCell>
                  <TableCell>{movement.quantity}</TableCell>
                  <TableCell>
                    {new Date(movement.createdAt).toLocaleString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
