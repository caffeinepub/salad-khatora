import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { useGetAllIngredients, useUpdateIngredient } from '../hooks/useQueries';
import type { Ingredient } from '../backend';

interface EditIngredientDialogProps {
  ingredientName: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function EditIngredientDialog({
  ingredientName,
  open,
  onOpenChange,
}: EditIngredientDialogProps) {
  const { data: ingredients } = useGetAllIngredients();
  const updateIngredientMutation = useUpdateIngredient();

  const [name, setName] = useState('');
  const [unitType, setUnitType] = useState('gram');
  const [lowStockThreshold, setLowStockThreshold] = useState('');
  const [supplierName, setSupplierName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [costPricePerUnit, setCostPricePerUnit] = useState('');

  useEffect(() => {
    if (ingredientName && ingredients) {
      const ingredient = ingredients.find(([name]) => name === ingredientName);
      if (ingredient) {
        const [_, data] = ingredient;
        setName(data.name);
        setUnitType(data.unitType);
        setLowStockThreshold(data.lowStockThreshold.toString());
        setSupplierName(data.supplierName);
        setQuantity(data.quantity.toString());
        setCostPricePerUnit(data.costPricePerUnit.toString());
      }
    }
  }, [ingredientName, ingredients]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const ingredient: Ingredient = {
      name,
      quantity: BigInt(quantity),
      costPricePerUnit: BigInt(costPricePerUnit),
      supplierName,
      lowStockThreshold: BigInt(lowStockThreshold),
      unitType,
    };

    await updateIngredientMutation.mutateAsync({ name: ingredientName, ingredient });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit Ingredient</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Ingredient Name *</Label>
              <Input
                id="edit-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="Enter ingredient name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-unitType">Unit Type *</Label>
              <Select value={unitType} onValueChange={setUnitType} required>
                <SelectTrigger id="edit-unitType">
                  <SelectValue placeholder="Select unit type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gram">Gram</SelectItem>
                  <SelectItem value="kg">Kilogram</SelectItem>
                  <SelectItem value="liter">Liter</SelectItem>
                  <SelectItem value="ml">Milliliter</SelectItem>
                  <SelectItem value="piece">Piece</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-quantity">Quantity *</Label>
              <Input
                id="edit-quantity"
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                required
                min="0"
                placeholder="Enter quantity"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-lowStockThreshold">Low Stock Threshold *</Label>
              <Input
                id="edit-lowStockThreshold"
                type="number"
                value={lowStockThreshold}
                onChange={(e) => setLowStockThreshold(e.target.value)}
                required
                min="0"
                placeholder="Enter threshold"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-supplierName">Supplier Name *</Label>
              <Input
                id="edit-supplierName"
                value={supplierName}
                onChange={(e) => setSupplierName(e.target.value)}
                required
                placeholder="Enter supplier name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-costPricePerUnit">Cost Price per Unit *</Label>
              <Input
                id="edit-costPricePerUnit"
                type="number"
                value={costPricePerUnit}
                onChange={(e) => setCostPricePerUnit(e.target.value)}
                required
                min="0"
                placeholder="Enter cost price"
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={updateIngredientMutation.isPending}
              className="bg-fresh-600 hover:bg-fresh-700"
            >
              {updateIngredientMutation.isPending ? 'Updating...' : 'Update Ingredient'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
