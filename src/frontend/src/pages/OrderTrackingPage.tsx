import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useOrders } from '../hooks/useQueries';
import OrderStatusTimeline from '../components/OrderStatusTimeline';
import type { Order } from '../backend';

export default function OrderTrackingPage() {
  const [searchValue, setSearchValue] = useState('');
  const [searchType, setSearchType] = useState<'phone' | 'orderId'>('phone');
  const { data: allOrders, isLoading } = useOrders();
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = () => {
    if (!searchValue.trim() || !allOrders) {
      return;
    }

    const filtered = allOrders.filter((order) => {
      if (searchType === 'phone') {
        return order.phone === searchValue.trim();
      } else {
        return order.orderId.toString() === searchValue.trim();
      }
    });

    setFilteredOrders(filtered);
    setHasSearched(true);
  };

  const getBowlSizeLabel = (bowlType: string) => {
    switch (bowlType) {
      case 'gm250':
        return '250gm';
      case 'gm350':
        return '350gm';
      case 'gm500':
        return '500gm';
      default:
        return 'Custom';
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Track Your Order</h1>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Search for Your Order</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <Button
              variant={searchType === 'phone' ? 'default' : 'outline'}
              onClick={() => setSearchType('phone')}
            >
              By Phone Number
            </Button>
            <Button
              variant={searchType === 'orderId' ? 'default' : 'outline'}
              onClick={() => setSearchType('orderId')}
            >
              By Order ID
            </Button>
          </div>

          <div>
            <Label htmlFor="search">
              {searchType === 'phone' ? 'Phone Number' : 'Order ID'}
            </Label>
            <div className="flex gap-2 mt-2">
              <Input
                id="search"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder={searchType === 'phone' ? 'Enter 10-digit phone number' : 'Enter order ID'}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
              <Button onClick={handleSearch} disabled={isLoading}>
                Search
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {hasSearched && (
        <div className="space-y-6">
          {filteredOrders.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-muted-foreground">
                  No orders found. Please check your {searchType === 'phone' ? 'phone number' : 'order ID'} and try again.
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredOrders.map((order) => (
              <Card key={order.orderId.toString()}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>Order #{order.orderId.toString()}</CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">
                        {new Date(Number(order.orderDate) / 1000000).toLocaleString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Total</p>
                      <p className="text-xl font-bold text-orange-600">₹{Number(order.orderTotal)}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <OrderStatusTimeline status={order.orderStatus} />

                  <div className="border-t pt-4">
                    <h4 className="font-semibold mb-3">Order Details</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Customer:</span>
                        <span className="font-medium">{order.customerName}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Phone:</span>
                        <span className="font-medium">{order.phone}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Delivery Address:</span>
                        <span className="font-medium text-right max-w-xs">{order.deliveryAddress}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Payment Mode:</span>
                        <span className="font-medium capitalize">{order.paymentMode}</span>
                      </div>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <h4 className="font-semibold mb-3">Items</h4>
                    <div className="space-y-2">
                      {order.items.map(([name, qty]) => (
                        <div key={name} className="flex justify-between text-sm">
                          <span>{name}</span>
                          <span className="text-muted-foreground">× {Number(qty)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}
    </div>
  );
}
