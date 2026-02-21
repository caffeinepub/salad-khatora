import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useGetAllIngredients, useRecordStockTransaction, useGetStockTransactionsByType } from '../hooks/useQueries';
import type { StockTransaction } from '../backend';
import StockTransactionTable from './StockTransactionTable';

export default function StockInTab() {
  const [ingredientName, setIngredientName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [supplier, setSupplier] = useState('');
  const [costPrice, setCostPrice] = useState('');
  const [reason, setReason] = useState('');

  const { data: ingredients } = useGetAllIngredients();
  const recordTransactionMutation = useRecordStockTransaction();
  const { data: stockInTransactions } = useGetStockTransactionsByType('stockIn');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const ingredient = ingredients?.find(([name]) => name === ingredientName);
    if (!ingredient) return;

    const transaction: StockTransaction = {
      transactionId: BigInt(0),
      ingredientName,
      quantity: BigInt(quantity),
      transactionType: { stockIn: null } as any,
      reason,
      date: BigInt(Date.now() * 1000000),
      supplier,
      costPrice: BigInt(costPrice),
      unitType: ingredient[1].unitType,
    };

    await recordTransactionMutation.mutateAsync(transaction);

    // Reset form
    setIngredientName('');
    setQuantity('');
    setSupplier('');
    setCostPrice('');
    setReason('');
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="bg-card p-6 rounded-lg border border-border space-y-4">
        <h2 className="text-xl font-semibold">Record Stock In</h2>

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
                    {name} ({ingredient.unitType})
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
              placeholder="Enter quantity"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="supplier">Supplier *</Label>
            <Input
              id="supplier"
              value={supplier}
              onChange={(e) => setSupplier(e.target.value)}
              required
              placeholder="Enter supplier name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="costPrice">Cost Price *</Label>
            <Input
              id="costPrice"
              type="number"
              value={costPrice}
              onChange={(e) => setCostPrice(e.target.value)}
              required
              min="0"
              placeholder="Enter cost price"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="reason">Reason</Label>
          <Textarea
            id="reason"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Enter reason for stock in"
            rows={2}
          />
        </div>

        <Button
          type="submit"
          disabled={recordTransactionMutation.isPending}
          className="w-full bg-fresh-600 hover:bg-fresh-700"
        >
          {recordTransactionMutation.isPending ? 'Recording...' : 'Record Stock In'}
        </Button>
      </form>

      <div>
        <h3 className="text-lg font-semibold mb-4">Stock In History</h3>
        <StockTransactionTable transactions={stockInTransactions || []} />
      </div>
    </div>
  );
}
