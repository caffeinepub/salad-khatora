import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useGetCallerUserProfile, useGetCustomerOrders } from '../hooks/useQueries';
import { Package, Calendar, MapPin, CreditCard } from 'lucide-react';
import { format } from 'date-fns';

export default function UserOrdersSection() {
  const { data: userProfile, isLoading: profileLoading } = useGetCallerUserProfile();
  const customerId = userProfile?.customerId ?? BigInt(0);
  
  const { data: orders, isLoading: ordersLoading } = useGetCustomerOrders(customerId);

  const isLoading = profileLoading || ordersLoading;

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-500';
      case 'preparing':
        return 'bg-blue-500';
      case 'ready':
        return 'bg-green-500';
      case 'delivered':
        return 'bg-gray-500';
      default:
        return 'bg-gray-500';
    }
  };

  const formatDate = (timestamp: bigint) => {
    try {
      const date = new Date(Number(timestamp) / 1000000);
      return format(date, 'MMM dd, yyyy HH:mm');
    } catch {
      return 'Invalid date';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center space-y-4">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-orange-600 border-t-transparent mx-auto"></div>
          <p className="text-muted-foreground">Loading orders...</p>
        </div>
      </div>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <div className="text-center py-12">
        <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold mb-2">No orders yet</h3>
        <p className="text-muted-foreground">Your order history will appear here</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Your Orders</h2>
        <p className="text-muted-foreground">Track and view your order history</p>
      </div>

      <div className="space-y-4">
        {orders.map((order) => (
          <Card key={Number(order.orderId)}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">Order #{Number(order.orderId)}</CardTitle>
                  <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                    <Calendar className="h-3 w-3" />
                    {formatDate(order.orderDate)}
                  </p>
                </div>
                <Badge className={getStatusColor(order.orderStatus)}>
                  {order.orderStatus}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h4 className="font-semibold text-sm">Items:</h4>
                {order.items.map(([itemName, quantity], idx) => (
                  <div key={idx} className="flex justify-between text-sm">
                    <span>{itemName} × {Number(quantity)}</span>
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>{order.deliveryAddress}</span>
              </div>

              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <CreditCard className="h-4 w-4" />
                <span>{order.paymentMode}</span>
              </div>

              <div className="pt-2 border-t flex justify-between items-center">
                <span className="font-semibold">Total:</span>
                <span className="text-xl font-bold text-orange-600">₹{Number(order.orderTotal)}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
