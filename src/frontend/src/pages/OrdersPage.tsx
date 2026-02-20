import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useOrders } from '../hooks/useQueries';
import OrderStatusDropdown from '../components/OrderStatusDropdown';
import { ChevronDown, ChevronRight } from 'lucide-react';
import type { Order } from '../backend';

export default function OrdersPage() {
  const { data: orders, isLoading } = useOrders();
  const [expandedOrder, setExpandedOrder] = useState<bigint | null>(null);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'preparing':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      case 'ready':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'delivered':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const toggleExpand = (orderId: bigint) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Orders</h1>
        <p className="text-muted-foreground mt-2">Manage and track all customer orders</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Orders</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : orders && orders.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12"></TableHead>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Items</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Payment</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.map((order) => (
                    <>
                      <TableRow key={order.orderId.toString()} className="cursor-pointer hover:bg-muted/50">
                        <TableCell onClick={() => toggleExpand(order.orderId)}>
                          {expandedOrder === order.orderId ? (
                            <ChevronDown className="h-4 w-4" />
                          ) : (
                            <ChevronRight className="h-4 w-4" />
                          )}
                        </TableCell>
                        <TableCell className="font-medium">#{order.orderId.toString()}</TableCell>
                        <TableCell>{order.customerName}</TableCell>
                        <TableCell>{order.phone}</TableCell>
                        <TableCell>{order.items.length} item(s)</TableCell>
                        <TableCell className="font-semibold">₹{Number(order.orderTotal)}</TableCell>
                        <TableCell className="capitalize">{order.paymentMode}</TableCell>
                        <TableCell>
                          <OrderStatusDropdown order={order} />
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {new Date(Number(order.orderDate) / 1000000).toLocaleDateString()}
                        </TableCell>
                      </TableRow>
                      {expandedOrder === order.orderId && (
                        <TableRow>
                          <TableCell colSpan={9} className="bg-muted/30">
                            <div className="p-4 space-y-4">
                              <div>
                                <h4 className="font-semibold mb-2">Delivery Address</h4>
                                <p className="text-sm text-muted-foreground">{order.deliveryAddress}</p>
                              </div>
                              <div>
                                <h4 className="font-semibold mb-2">Order Items</h4>
                                <div className="space-y-1">
                                  {order.items.map(([name, qty]) => (
                                    <div key={name} className="flex justify-between text-sm">
                                      <span>{name}</span>
                                      <span className="text-muted-foreground">Quantity: {Number(qty)}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No orders yet</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
