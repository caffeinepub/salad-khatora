import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAllIngredients, useRecordWriteOff, useGetStockTransactionsByType } from '../hooks/useQueries';
import { toast } from 'sonner';
import StockTransactionTable from './StockTransactionTable';
import { StockTransactionType } from '../backend';

export default function WriteOffTab() {
  const { data: ingredients = [] } = useAllIngredients();
  const recordWriteOff = useRecordWriteOff();
  const { data: transactions = [], isLoading: isLoadingTransactions } = useGetStockTransactionsByType(StockTransactionType.writeOff);

  const [formData, setFormData] = useState({
    ingredientName: '',
    quantity: '',
    reason: '',
    date: new Date().toISOString().split('T')[0],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const quantity = parseInt(formData.quantity);

    if (!formData.ingredientName) {
      toast.error('Please select an ingredient');
      return;
    }

    if (isNaN(quantity) || quantity <= 0) {
      toast.error('Please enter a valid quantity');
      return;
    }

    if (!formData.reason.trim()) {
      toast.error('Please enter a reason');
      return;
    }

    const selectedIngredient = ingredients.find(i => i.name === formData.ingredientName);
    if (!selectedIngredient) {
      toast.error('Selected ingredient not found');
      return;
    }

    if (selectedIngredient.quantity < BigInt(quantity)) {
      toast.error(`Insufficient stock. Available: ${selectedIngredient.quantity}`);
      return;
    }

    try {
      await recordWriteOff.mutateAsync({
        ingredientName: formData.ingredientName,
        quantity: BigInt(quantity),
        reason: formData.reason,
      });

      toast.success('Write-off recorded successfully');
      setFormData({
        ingredientName: '',
        quantity: '',
        reason: '',
        date: new Date().toISOString().split('T')[0],
      });
    } catch (error) {
      toast.error('Failed to record write-off');
      console.error('Write-off error:', error);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Record Write-Off</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="ingredient">Ingredient *</Label>
                <Select
                  value={formData.ingredientName}
                  onValueChange={(value) => setFormData({ ...formData, ingredientName: value })}
                >
                  <SelectTrigger id="ingredient">
                    <SelectValue placeholder="Select ingredient" />
                  </SelectTrigger>
                  <SelectContent>
                    {ingredients.map((ingredient) => (
                      <SelectItem key={ingredient.name} value={ingredient.name}>
                        {ingredient.name} (Available: {ingredient.quantity.toString()})
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
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                  placeholder="Enter quantity"
                  min="1"
                  required
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="reason">Reason *</Label>
                <Textarea
                  id="reason"
                  value={formData.reason}
                  onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                  placeholder="e.g., Expired, Damaged, Spoiled, etc."
                  rows={3}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="date">Date *</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <Button 
                type="submit" 
                disabled={recordWriteOff.isPending}
                className="bg-fresh-600 hover:bg-fresh-700"
              >
                {recordWriteOff.isPending ? 'Recording...' : 'Record Write-Off'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Write-Off History</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoadingTransactions ? (
            <div className="text-center py-8 text-muted-foreground">
              Loading transactions...
            </div>
          ) : (
            <StockTransactionTable transactions={transactions} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
