import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

interface InvoiceItem {
  productName: string;
  quantity: string;
  price: string;
}

// TODO: Replace with actual data from backend
const availableProducts = [
  { name: 'Classic Garden Bowl', price: 150, bowlType: '250gm', available: true },
  { name: 'Premium Veggie Bowl', price: 200, bowlType: '350gm', available: true },
  { name: 'Deluxe Bowl', price: 250, bowlType: '500gm', available: true },
  { name: 'Custom Mix Bowl', price: 180, bowlType: 'custom', available: true },
];

interface BillingFormProps {
  onSuccess?: () => void;
}

export default function BillingForm({ onSuccess }: BillingFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    customerName: '',
    phoneNumber: '',
    paymentMode: 'cash',
    discount: '',
  });
  const [items, setItems] = useState<InvoiceItem[]>([{ productName: '', quantity: '1', price: '' }]);

  const addItem = () => {
    setItems([...items, { productName: '', quantity: '1', price: '' }]);
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const updateItem = (index: number, field: keyof InvoiceItem, value: string) => {
    const updated = [...items];
    updated[index][field] = value;

    // Auto-fill price when product is selected
    if (field === 'productName') {
      const product = availableProducts.find(p => p.name === value);
      if (product) {
        updated[index].price = product.price.toString();
      }
    }

    setItems(updated);
  };

  const calculateSubtotal = () => {
    return items.reduce((sum, item) => {
      const itemTotal = (parseFloat(item.price) || 0) * (parseInt(item.quantity) || 0);
      return sum + itemTotal;
    }, 0);
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const discount = parseFloat(formData.discount) || 0;
    return Math.max(0, subtotal - discount);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // TODO: Call backend API once available
      // await actor.createInvoice({...formData, items, total: calculateTotal()});
      
      toast.success('Invoice created successfully');
      setFormData({ customerName: '', phoneNumber: '', paymentMode: 'cash', discount: '' });
      setItems([{ productName: '', quantity: '1', price: '' }]);
      onSuccess?.();
    } catch (error) {
      toast.error('Failed to create invoice');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="customerName">Customer Name *</Label>
          <Input
            id="customerName"
            value={formData.customerName}
            onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
            placeholder="Enter customer name"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phoneNumber">Phone Number</Label>
          <Input
            id="phoneNumber"
            type="tel"
            value={formData.phoneNumber}
            onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
            placeholder="10-digit mobile number"
            pattern="[0-9]{10}"
          />
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Order Items</CardTitle>
            <Button type="button" variant="outline" size="sm" onClick={addItem}>
              <Plus className="h-4 w-4 mr-1" />
              Add Item
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {items.map((item, index) => (
            <div key={index} className="flex gap-2">
              <div className="flex-1">
                <Select
                  value={item.productName}
                  onValueChange={(value) => updateItem(index, 'productName', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select product" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableProducts
                      .filter(p => p.available)
                      .map((product) => (
                        <SelectItem key={product.name} value={product.name}>
                          {product.name} ({product.bowlType}) - ₹{product.price}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="w-20">
                <Input
                  type="number"
                  placeholder="Qty"
                  value={item.quantity}
                  onChange={(e) => updateItem(index, 'quantity', e.target.value)}
                  required
                  min="1"
                />
              </div>
              <div className="w-24">
                <Input
                  type="number"
                  placeholder="Price"
                  value={item.price}
                  onChange={(e) => updateItem(index, 'price', e.target.value)}
                  required
                  min="0"
                />
              </div>
              {items.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeItem(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="paymentMode">Payment Mode *</Label>
          <Select
            value={formData.paymentMode}
            onValueChange={(value) => setFormData({ ...formData, paymentMode: value })}
          >
            <SelectTrigger id="paymentMode">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="cash">Cash</SelectItem>
              <SelectItem value="upi">UPI</SelectItem>
              <SelectItem value="card">Card</SelectItem>
              <SelectItem value="online">Online Transfer</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="discount">Discount (₹)</Label>
          <Input
            id="discount"
            type="number"
            value={formData.discount}
            onChange={(e) => setFormData({ ...formData, discount: e.target.value })}
            placeholder="0"
            min="0"
          />
        </div>
      </div>

      <Card className="bg-muted/50">
        <CardContent className="pt-6">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Subtotal:</span>
              <span>₹{calculateSubtotal().toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Discount:</span>
              <span>- ₹{(parseFloat(formData.discount) || 0).toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-lg font-bold pt-2 border-t">
              <span>Total:</span>
              <span>₹{calculateTotal().toFixed(2)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Button type="submit" disabled={isSubmitting} className="w-full bg-fresh-600 hover:bg-fresh-700">
        {isSubmitting ? 'Creating...' : 'Create Invoice'}
      </Button>
    </form>
  );
}
