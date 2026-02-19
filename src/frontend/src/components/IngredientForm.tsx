import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

interface IngredientFormProps {
  onSuccess?: () => void;
}

export default function IngredientForm({ onSuccess }: IngredientFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    quantity: '',
    unitType: 'grams',
    costPricePerUnit: '',
    supplierName: '',
    lowStockThreshold: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // TODO: Call backend API once available
      // await actor.addIngredient({...formData});
      
      toast.success('Ingredient added successfully');
      setFormData({
        name: '',
        quantity: '',
        unitType: 'grams',
        costPricePerUnit: '',
        supplierName: '',
        lowStockThreshold: '',
      });
      onSuccess?.();
    } catch (error) {
      toast.error('Failed to add ingredient');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">Ingredient Name *</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="e.g., Lettuce"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="supplierName">Supplier Name *</Label>
          <Input
            id="supplierName"
            value={formData.supplierName}
            onChange={(e) => setFormData({ ...formData, supplierName: e.target.value })}
            placeholder="e.g., Fresh Farms"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="quantity">Current Quantity *</Label>
          <Input
            id="quantity"
            type="number"
            value={formData.quantity}
            onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
            placeholder="e.g., 5000"
            required
            min="0"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="unitType">Unit Type *</Label>
          <Select value={formData.unitType} onValueChange={(value) => setFormData({ ...formData, unitType: value })}>
            <SelectTrigger id="unitType">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="grams">Grams</SelectItem>
              <SelectItem value="kilograms">Kilograms</SelectItem>
              <SelectItem value="pieces">Pieces</SelectItem>
              <SelectItem value="liters">Liters</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="costPricePerUnit">Cost Price per Unit (₹) *</Label>
          <Input
            id="costPricePerUnit"
            type="number"
            value={formData.costPricePerUnit}
            onChange={(e) => setFormData({ ...formData, costPricePerUnit: e.target.value })}
            placeholder="e.g., 2"
            required
            min="0"
            step="0.01"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="lowStockThreshold">Low Stock Threshold *</Label>
          <Input
            id="lowStockThreshold"
            type="number"
            value={formData.lowStockThreshold}
            onChange={(e) => setFormData({ ...formData, lowStockThreshold: e.target.value })}
            placeholder="e.g., 1000"
            required
            min="0"
          />
        </div>
      </div>

      <Button type="submit" disabled={isSubmitting} className="w-full bg-fresh-600 hover:bg-fresh-700">
        {isSubmitting ? 'Adding...' : 'Add Ingredient'}
      </Button>
    </form>
  );
}
