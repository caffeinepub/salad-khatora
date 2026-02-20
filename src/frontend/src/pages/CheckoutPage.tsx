import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useCart } from '../contexts/CartContext';
import { useAddOrder } from '../hooks/useQueries';
import { toast } from 'sonner';

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { items, getTotal, clearCart } = useCart();
  const addOrderMutation = useAddOrder();

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    paymentMode: 'cash',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\d{10}$/.test(formData.phone.trim())) {
      newErrors.phone = 'Phone number must be 10 digits';
    }

    if (!formData.address.trim()) {
      newErrors.address = 'Delivery address is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    if (items.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    try {
      const orderItems: [string, bigint][] = items.map((item) => [
        item.product.name,
        BigInt(item.quantity),
      ]);

      const orderId = await addOrderMutation.mutateAsync({
        customerId: BigInt(0),
        customerName: formData.name,
        phone: formData.phone,
        deliveryAddress: formData.address,
        items: orderItems,
        orderTotal: BigInt(getTotal()),
        paymentMode: formData.paymentMode,
        orderStatus: 'pending',
      });

      clearCart();
      navigate({ to: `/user/order-confirmation/${orderId}` });
    } catch (error) {
      console.error('Order submission error:', error);
      toast.error('Failed to place order. Please try again.');
    }
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

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto text-center py-12">
        <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
        <p className="text-muted-foreground mb-6">Add some items to your cart before checking out.</p>
        <Button onClick={() => navigate({ to: '/user/menu' })}>Browse Menu</Button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Order Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Order Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {items.map((item) => (
              <div key={item.product.name} className="flex justify-between items-start pb-4 border-b">
                <div className="flex-1">
                  <h4 className="font-semibold">{item.product.name}</h4>
                  <p className="text-sm text-muted-foreground">
                    {getBowlSizeLabel(item.product.bowlType)} × {item.quantity}
                  </p>
                </div>
                <p className="font-semibold">₹{Number(item.product.price) * item.quantity}</p>
              </div>
            ))}
            <div className="flex justify-between items-center text-lg font-bold pt-4">
              <span>Total:</span>
              <span className="text-orange-600">₹{getTotal()}</span>
            </div>
          </CardContent>
        </Card>

        {/* Customer Information Form */}
        <Card>
          <CardHeader>
            <CardTitle>Delivery Information</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className={errors.name ? 'border-red-500' : ''}
                />
                {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name}</p>}
              </div>

              <div>
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="10-digit mobile number"
                  className={errors.phone ? 'border-red-500' : ''}
                />
                {errors.phone && <p className="text-sm text-red-500 mt-1">{errors.phone}</p>}
              </div>

              <div>
                <Label htmlFor="address">Delivery Address *</Label>
                <Textarea
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  rows={3}
                  className={errors.address ? 'border-red-500' : ''}
                />
                {errors.address && <p className="text-sm text-red-500 mt-1">{errors.address}</p>}
              </div>

              <div>
                <Label>Payment Mode *</Label>
                <RadioGroup
                  value={formData.paymentMode}
                  onValueChange={(value) => setFormData({ ...formData, paymentMode: value })}
                  className="mt-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="cash" id="cash" />
                    <Label htmlFor="cash" className="font-normal cursor-pointer">
                      Cash on Delivery
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="online" id="online" />
                    <Label htmlFor="online" className="font-normal cursor-pointer">
                      Online Payment
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <Button
                type="submit"
                className="w-full"
                size="lg"
                disabled={addOrderMutation.isPending}
              >
                {addOrderMutation.isPending ? 'Placing Order...' : 'Place Order'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
