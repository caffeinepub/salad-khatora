import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAddIngredient } from '../hooks/useQueries';
import type { Ingredient } from '../backend';

interface IngredientFormProps {
  onSuccess?: () => void;
}

export default function IngredientForm({ onSuccess }: IngredientFormProps) {
  const [name, setName] = useState('');
  const [unitType, setUnitType] = useState('gram');
  const [lowStockThreshold, setLowStockThreshold] = useState('');
  const [supplierName, setSupplierName] = useState('');
  const [initialQuantity, setInitialQuantity] = useState('');
  const [costPricePerUnit, setCostPricePerUnit] = useState('');

  const addIngredientMutation = useAddIngredient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const ingredient: Ingredient = {
      name,
      quantity: BigInt(initialQuantity),
      costPricePerUnit: BigInt(costPricePerUnit),
      supplierName,
      lowStockThreshold: BigInt(lowStockThreshold),
      unitType,
    };

    await addIngredientMutation.mutateAsync(ingredient);

    // Reset form
    setName('');
    setUnitType('gram');
    setLowStockThreshold('');
    setSupplierName('');
    setInitialQuantity('');
    setCostPricePerUnit('');

    if (onSuccess) {
      onSuccess();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-card p-6 rounded-lg border border-border">
      <h3 className="text-lg font-semibold">Add New Ingredient</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Ingredient Name *</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder="Enter ingredient name"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="unitType">Unit Type *</Label>
          <Select value={unitType} onValueChange={setUnitType} required>
            <SelectTrigger id="unitType">
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
          <Label htmlFor="initialQuantity">Initial Quantity *</Label>
          <Input
            id="initialQuantity"
            type="number"
            value={initialQuantity}
            onChange={(e) => setInitialQuantity(e.target.value)}
            required
            min="0"
            placeholder="Enter initial quantity"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="lowStockThreshold">Low Stock Threshold *</Label>
          <Input
            id="lowStockThreshold"
            type="number"
            value={lowStockThreshold}
            onChange={(e) => setLowStockThreshold(e.target.value)}
            required
            min="0"
            placeholder="Enter threshold"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="supplierName">Supplier Name *</Label>
          <Input
            id="supplierName"
            value={supplierName}
            onChange={(e) => setSupplierName(e.target.value)}
            required
            placeholder="Enter supplier name"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="costPricePerUnit">Cost Price per Unit *</Label>
          <Input
            id="costPricePerUnit"
            type="number"
            value={costPricePerUnit}
            onChange={(e) => setCostPricePerUnit(e.target.value)}
            required
            min="0"
            placeholder="Enter cost price"
          />
        </div>
      </div>

      <Button
        type="submit"
        disabled={addIngredientMutation.isPending}
        className="w-full bg-fresh-600 hover:bg-fresh-700"
      >
        {addIngredientMutation.isPending ? 'Adding Ingredient...' : 'Add Ingredient'}
      </Button>
    </form>
  );
}
