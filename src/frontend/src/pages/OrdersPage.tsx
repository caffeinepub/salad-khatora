import { useAllOrders } from '../hooks/useQueries';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function OrdersPage() {
  const { data: orders, isLoading } = useAllOrders();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-fresh-600" />
      </div>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Orders</h1>
          <p className="text-muted-foreground mt-2">Manage customer orders</p>
        </div>
        <div className="text-center py-8 text-muted-foreground">
          No orders found. Orders will appear here when customers place them.
        </div>
      </div>
    );
  }

  const sortedOrders = [...orders].sort((a, b) => 
    Number(b[1].orderDate - a[1].orderDate)
  );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Orders</h1>
        <p className="text-muted-foreground mt-2">Manage customer orders</p>
      </div>

      <div className="bg-card rounded-lg border border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Items</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedOrders.map(([id, order]) => (
              <TableRow key={id.toString()}>
                <TableCell className="font-medium">#{id.toString()}</TableCell>
                <TableCell>
                  {new Date(Number(order.orderDate) / 1000000).toLocaleDateString('en-IN', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                  })}
                </TableCell>
                <TableCell>{order.customerName}</TableCell>
                <TableCell>{order.phone}</TableCell>
                <TableCell>
                  <div className="space-y-1">
                    {order.items.map(([name, qty], i) => (
                      <div key={i} className="text-sm">
                        {name} × {qty.toString()}
                      </div>
                    ))}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge
                    variant={
                      order.orderStatus === 'Delivered'
                        ? 'default'
                        : order.orderStatus === 'Preparing'
                        ? 'secondary'
                        : 'outline'
                    }
                  >
                    {order.orderStatus}
                  </Badge>
                </TableCell>
                <TableCell className="text-right font-semibold">
                  ₹{Number(order.orderTotal)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
