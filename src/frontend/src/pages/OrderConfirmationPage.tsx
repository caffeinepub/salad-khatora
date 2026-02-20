import { useParams, useNavigate } from '@tanstack/react-router';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';

export default function OrderConfirmationPage() {
  const { orderId } = useParams({ from: '/user/order-confirmation/$orderId' });
  const navigate = useNavigate();

  return (
    <div className="max-w-2xl mx-auto text-center py-12">
      <div className="mb-8">
        <CheckCircle className="h-20 w-20 text-green-600 mx-auto mb-4" />
        <h1 className="text-3xl font-bold mb-2">Order Placed Successfully!</h1>
        <p className="text-muted-foreground">Thank you for your order</p>
      </div>

      <Card className="mb-8">
        <CardContent className="p-8">
          <div className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Order ID</p>
              <p className="text-2xl font-bold text-orange-600">#{orderId}</p>
            </div>
            <div className="border-t pt-4">
              <p className="text-sm text-muted-foreground mb-2">Estimated Preparation Time</p>
              <p className="text-lg font-semibold">30-45 minutes</p>
            </div>
            <div className="border-t pt-4">
              <p className="text-muted-foreground">
                You can track your order status using your order ID or phone number
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button
          variant="outline"
          size="lg"
          onClick={() => navigate({ to: '/user/track-order' })}
        >
          Track Order
        </Button>
        <Button size="lg" onClick={() => navigate({ to: '/user/menu' })}>
          Back to Menu
        </Button>
      </div>
    </div>
  );
}
