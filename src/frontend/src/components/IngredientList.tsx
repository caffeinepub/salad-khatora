import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, AlertTriangle } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

// TODO: Replace with actual data from backend once available
const mockIngredients = [
  {
    name: 'Lettuce',
    quantity: 5000,
    unitType: 'grams',
    costPricePerUnit: 2,
    supplierName: 'Fresh Farms',
    lowStockThreshold: 1000,
  },
  {
    name: 'Tomatoes',
    quantity: 450,
    unitType: 'grams',
    costPricePerUnit: 3,
    supplierName: 'Green Valley',
    lowStockThreshold: 500,
  },
  {
    name: 'Cucumber',
    quantity: 3000,
    unitType: 'grams',
    costPricePerUnit: 1.5,
    supplierName: 'Fresh Farms',
    lowStockThreshold: 800,
  },
  {
    name: 'Carrots',
    quantity: 2500,
    unitType: 'grams',
    costPricePerUnit: 2.5,
    supplierName: 'Organic Harvest',
    lowStockThreshold: 1000,
  },
];

export default function IngredientList() {
  const totalValue = mockIngredients.reduce(
    (sum, item) => sum + item.quantity * item.costPricePerUnit,
    0
  );

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Total Inventory Value</CardTitle>
            <div className="text-2xl font-bold text-fresh-600">₹{totalValue.toLocaleString()}</div>
          </div>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Ingredients</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Cost/Unit</TableHead>
                  <TableHead>Total Value</TableHead>
                  <TableHead>Supplier</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockIngredients.map((ingredient, index) => {
                  const isLowStock = ingredient.quantity < ingredient.lowStockThreshold;
                  const totalValue = ingredient.quantity * ingredient.costPricePerUnit;

                  return (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{ingredient.name}</TableCell>
                      <TableCell>
                        {ingredient.quantity} {ingredient.unitType}
                      </TableCell>
                      <TableCell>₹{ingredient.costPricePerUnit}</TableCell>
                      <TableCell>₹{totalValue.toFixed(2)}</TableCell>
                      <TableCell>{ingredient.supplierName}</TableCell>
                      <TableCell>
                        {isLowStock ? (
                          <Badge variant="destructive" className="gap-1">
                            <AlertTriangle className="h-3 w-3" />
                            Low Stock
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="bg-fresh-50 dark:bg-fresh-900/20 text-fresh-700 dark:text-fresh-400 border-fresh-200 dark:border-fresh-800">
                            In Stock
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
