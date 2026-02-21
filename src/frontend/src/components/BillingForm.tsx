import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAllProducts, useCreateInvoice } from '../hooks/useQueries';
import { Plus, Trash2 } from 'lucide-react';
import type { Invoice } from '../backend';

interface OrderItem {
  productName: string;
  quantity: number;
  price: number;
}

export default function BillingForm() {
  const [customerName, setCustomerName] = useState('');
  const [paymentMode, setPaymentMode] = useState('');
  const [items, setItems] = useState<OrderItem[]>([]);
  const [selectedProduct, setSelectedProduct] = useState('');

  const { data: products } = useAllProducts();
  const createInvoiceMutation = useCreateInvoice();

  const availableProducts = products?.filter(([_, product]) => product.active) || [];

  const addItem = () => {
    if (!selectedProduct) return;

    const product = availableProducts.find(([_, p]) => p.name === selectedProduct);
    if (!product) return;

    const [_, productData] = product;
    const existingItem = items.find((item) => item.productName === selectedProduct);

    if (existingItem) {
      setItems(
        items.map((item) =>
          item.productName === selectedProduct
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setItems([
        ...items,
        {
          productName: selectedProduct,
          quantity: 1,
          price: Number(productData.price),
        },
      ]);
    }

    setSelectedProduct('');
  };

  const removeItem = (productName: string) => {
    setItems(items.filter((item) => item.productName !== productName));
  };

  const updateQuantity = (productName: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productName);
      return;
    }
    setItems(
      items.map((item) =>
        item.productName === productName ? { ...item, quantity } : item
      )
    );
  };

  const calculateTotal = () => {
    return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (items.length === 0) {
      return;
    }

    const invoice: Invoice = {
      customerName,
      itemsOrdered: items.map((item) => [item.productName, BigInt(item.quantity)]),
      totalPrice: BigInt(calculateTotal()),
      paymentMode,
      timestamp: BigInt(Date.now() * 1000000),
    };

    await createInvoiceMutation.mutateAsync(invoice);

    // Reset form
    setCustomerName('');
    setPaymentMode('');
    setItems([]);
    setSelectedProduct('');
  };

  const total = calculateTotal();

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-card p-6 rounded-lg border border-border">
      <h2 className="text-xl font-semibold text-foreground">Create Invoice</h2>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="customerName">Customer Name *</Label>
          <Input
            id="customerName"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            required
            placeholder="Enter customer name"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="paymentMode">Payment Mode *</Label>
          <Select value={paymentMode} onValueChange={setPaymentMode} required>
            <SelectTrigger id="paymentMode">
              <SelectValue placeholder="Select payment mode" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Cash">Cash</SelectItem>
              <SelectItem value="Card">Card</SelectItem>
              <SelectItem value="Online">Online</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Add Items</Label>
          <div className="flex gap-2">
            <Select value={selectedProduct} onValueChange={setSelectedProduct}>
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="Select product" />
              </SelectTrigger>
              <SelectContent>
                {availableProducts.map(([id, product]) => (
                  <SelectItem key={id.toString()} value={product.name}>
                    {product.name} - ₹{Number(product.price)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button type="button" onClick={addItem} size="icon">
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {items.length > 0 && (
          <div className="space-y-2">
            <Label>Order Items</Label>
            <div className="border border-border rounded-lg divide-y divide-border">
              {items.map((item) => (
                <div key={item.productName} className="p-3 flex items-center justify-between">
                  <div className="flex-1">
                    <p className="font-medium">{item.productName}</p>
                    <p className="text-sm text-muted-foreground">₹{item.price} each</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => updateQuantity(item.productName, parseInt(e.target.value))}
                      className="w-20"
                    />
                    <span className="font-medium w-20 text-right">
                      ₹{item.price * item.quantity}
                    </span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeItem(item.productName)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {items.length > 0 && (
          <div className="flex justify-between items-center pt-4 border-t border-border">
            <span className="text-lg font-semibold">Total:</span>
            <span className="text-2xl font-bold text-fresh-600">₹{total}</span>
          </div>
        )}
      </div>

      <Button
        type="submit"
        disabled={createInvoiceMutation.isPending || items.length === 0}
        className="w-full bg-fresh-600 hover:bg-fresh-700"
      >
        {createInvoiceMutation.isPending ? 'Creating Invoice...' : 'Create Invoice'}
      </Button>
    </form>
  );
}
