import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAddIngredient } from '../hooks/useQueries';

interface IngredientFormProps {
  onSuccess?: () => void;
}

export default function IngredientForm({ onSuccess }: IngredientFormProps) {
  const addIngredient = useAddIngredient();
  const [formData, setFormData] = useState({
    name: '',
    quantity: '',
    costPricePerUnit: '',
    supplierName: '',
    lowStockThreshold: '',
    unitType: 'gram',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const quantity = parseInt(formData.quantity);
    const costPricePerUnit = parseInt(formData.costPricePerUnit);
    const lowStockThreshold = parseInt(formData.lowStockThreshold);

    if (isNaN(quantity) || quantity < 0) {
      return;
    }
    if (isNaN(costPricePerUnit) || costPricePerUnit < 0) {
      return;
    }
    if (isNaN(lowStockThreshold) || lowStockThreshold < 0) {
      return;
    }

    try {
      await addIngredient.mutateAsync({
        name: formData.name,
        quantity: BigInt(quantity),
        costPricePerUnit: BigInt(costPricePerUnit),
        supplierName: formData.supplierName,
        lowStockThreshold: BigInt(lowStockThreshold),
        unitType: formData.unitType,
      });

      setFormData({
        name: '',
        quantity: '',
        costPricePerUnit: '',
        supplierName: '',
        lowStockThreshold: '',
        unitType: 'gram',
      });
      onSuccess?.();
    } catch (error) {
      console.error('Failed to add ingredient:', error);
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
          <Label htmlFor="quantity">Current Quantity (grams) *</Label>
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
          <Label htmlFor="costPricePerUnit">Cost Price per Unit (₹) *</Label>
          <Input
            id="costPricePerUnit"
            type="number"
            value={formData.costPricePerUnit}
            onChange={(e) => setFormData({ ...formData, costPricePerUnit: e.target.value })}
            placeholder="e.g., 2"
            required
            min="0"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="lowStockThreshold">Low Stock Threshold (grams) *</Label>
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

      <Button 
        type="submit" 
        disabled={addIngredient.isPending} 
        className="w-full bg-fresh-600 hover:bg-fresh-700"
      >
        {addIngredient.isPending ? 'Adding...' : 'Add Ingredient'}
      </Button>
    </form>
  );
}
