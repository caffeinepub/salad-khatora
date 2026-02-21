import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useGetAllIngredients, useRecordStockTransaction, useGetStockTransactionsByType } from '../hooks/useQueries';
import type { StockTransaction } from '../backend';
import StockTransactionTable from './StockTransactionTable';
import { toast } from 'sonner';

export default function WriteOffTab() {
  const [ingredientName, setIngredientName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [reason, setReason] = useState('');

  const { data: ingredients } = useGetAllIngredients();
  const recordTransactionMutation = useRecordStockTransaction();
  const { data: writeOffTransactions } = useGetStockTransactionsByType('writeOff');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const ingredient = ingredients?.find(([name]) => name === ingredientName);
    if (!ingredient) return;

    const availableQuantity = Number(ingredient[1].quantity);
    const requestedQuantity = Number(quantity);

    if (requestedQuantity > availableQuantity) {
      toast.error(`Insufficient stock. Available: ${availableQuantity} ${ingredient[1].unitType}`);
      return;
    }

    const transaction: StockTransaction = {
      transactionId: BigInt(0),
      ingredientName,
      quantity: BigInt(quantity),
      transactionType: { writeOff: null } as any,
      reason,
      date: BigInt(Date.now() * 1000000),
      supplier: undefined,
      costPrice: undefined,
      unitType: ingredient[1].unitType,
    };

    await recordTransactionMutation.mutateAsync(transaction);

    // Reset form
    setIngredientName('');
    setQuantity('');
    setReason('');
  };

  const selectedIngredient = ingredients?.find(([name]) => name === ingredientName);

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="bg-card p-6 rounded-lg border border-border space-y-4">
        <h2 className="text-xl font-semibold">Record Write Off</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="ingredient">Ingredient *</Label>
            <Select value={ingredientName} onValueChange={setIngredientName} required>
              <SelectTrigger id="ingredient">
                <SelectValue placeholder="Select ingredient" />
              </SelectTrigger>
              <SelectContent>
                {ingredients?.map(([name, ingredient]) => (
                  <SelectItem key={name} value={name}>
                    {name} ({ingredient.quantity.toString()} {ingredient.unitType} available)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="quantity">Quantity *</Label>
            <Input
              id="quantity"
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              required
              min="1"
              max={selectedIngredient ? Number(selectedIngredient[1].quantity) : undefined}
              placeholder="Enter quantity"
            />
            {selectedIngredient && (
              <p className="text-sm text-muted-foreground">
                Available: {selectedIngredient[1].quantity.toString()} {selectedIngredient[1].unitType}
              </p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="reason">Reason for Write Off *</Label>
          <Textarea
            id="reason"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            required
            placeholder="Enter reason (e.g., damaged, expired, spoiled)"
            rows={2}
          />
        </div>

        <Button
          type="submit"
          disabled={recordTransactionMutation.isPending}
          className="w-full bg-fresh-600 hover:bg-fresh-700"
        >
          {recordTransactionMutation.isPending ? 'Recording...' : 'Record Write Off'}
        </Button>
      </form>

      <div>
        <h3 className="text-lg font-semibold mb-4">Write Off History</h3>
        <StockTransactionTable transactions={writeOffTransactions || []} />
      </div>
    </div>
  );
}
