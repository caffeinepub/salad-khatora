import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { useUpdateIngredient } from '../hooks/useQueries';
import type { Ingredient } from '../backend';

interface EditIngredientDialogProps {
  ingredient: Ingredient;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function EditIngredientDialog({ ingredient, open, onOpenChange }: EditIngredientDialogProps) {
  const updateIngredient = useUpdateIngredient();

  const [formData, setFormData] = useState({
    name: ingredient.name,
    quantity: ingredient.quantity.toString(),
    costPricePerUnit: ingredient.costPricePerUnit.toString(),
    supplierName: ingredient.supplierName,
    lowStockThreshold: ingredient.lowStockThreshold.toString(),
    unitType: ingredient.unitType || 'gram',
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
      await updateIngredient.mutateAsync({
        name: ingredient.name,
        updatedIngredient: {
          name: formData.name,
          quantity: BigInt(quantity),
          costPricePerUnit: BigInt(costPricePerUnit),
          supplierName: formData.supplierName,
          lowStockThreshold: BigInt(lowStockThreshold),
          unitType: formData.unitType,
        },
      });

      onOpenChange(false);
    } catch (error) {
      console.error('Failed to update ingredient:', error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Ingredient</DialogTitle>
          <DialogDescription>
            Update ingredient details for {ingredient.name}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="edit-ingredient-name">Ingredient Name *</Label>
            <Input
              id="edit-ingredient-name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Lettuce"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-supplier-name">Supplier Name *</Label>
            <Input
              id="edit-supplier-name"
              value={formData.supplierName}
              onChange={(e) => setFormData({ ...formData, supplierName: e.target.value })}
              placeholder="e.g., Fresh Farms"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-quantity">Current Quantity (grams) *</Label>
            <Input
              id="edit-quantity"
              type="number"
              value={formData.quantity}
              onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
              placeholder="e.g., 5000"
              required
              min="0"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-cost-price">Cost Price per Unit (₹) *</Label>
            <Input
              id="edit-cost-price"
              type="number"
              value={formData.costPricePerUnit}
              onChange={(e) => setFormData({ ...formData, costPricePerUnit: e.target.value })}
              placeholder="e.g., 2"
              required
              min="0"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-low-stock">Low Stock Threshold (grams) *</Label>
            <Input
              id="edit-low-stock"
              type="number"
              value={formData.lowStockThreshold}
              onChange={(e) => setFormData({ ...formData, lowStockThreshold: e.target.value })}
              placeholder="e.g., 1000"
              required
              min="0"
            />
          </div>

          <div className="flex gap-2 justify-end pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={updateIngredient.isPending}
              className="bg-fresh-600 hover:bg-fresh-700"
            >
              {updateIngredient.isPending ? 'Updating...' : 'Update Ingredient'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
