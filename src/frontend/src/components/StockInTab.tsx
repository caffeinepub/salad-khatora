import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAllIngredients, useRecordStockIn, useGetStockTransactionsByType } from '../hooks/useQueries';
import { toast } from 'sonner';
import StockTransactionTable from './StockTransactionTable';
import { StockTransactionType } from '../backend';

export default function StockInTab() {
  const { data: ingredients = [] } = useAllIngredients();
  const recordStockIn = useRecordStockIn();
  const { data: transactions = [], isLoading: isLoadingTransactions } = useGetStockTransactionsByType(StockTransactionType.stockIn);

  const [formData, setFormData] = useState({
    ingredientName: '',
    quantity: '',
    supplier: '',
    costPrice: '',
    date: new Date().toISOString().split('T')[0],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const quantity = parseInt(formData.quantity);
    const costPrice = parseInt(formData.costPrice);

    if (!formData.ingredientName) {
      toast.error('Please select an ingredient');
      return;
    }

    if (isNaN(quantity) || quantity <= 0) {
      toast.error('Please enter a valid quantity');
      return;
    }

    if (isNaN(costPrice) || costPrice < 0) {
      toast.error('Please enter a valid cost price');
      return;
    }

    if (!formData.supplier.trim()) {
      toast.error('Please enter supplier name');
      return;
    }

    const selectedIngredient = ingredients.find(i => i.name === formData.ingredientName);
    if (!selectedIngredient) {
      toast.error('Selected ingredient not found');
      return;
    }

    try {
      await recordStockIn.mutateAsync({
        ingredientName: formData.ingredientName,
        quantity: BigInt(quantity),
        supplier: formData.supplier,
        costPrice: BigInt(costPrice),
        unitType: selectedIngredient.unitType,
      });

      toast.success('Stock added successfully');
      setFormData({
        ingredientName: '',
        quantity: '',
        supplier: '',
        costPrice: '',
        date: new Date().toISOString().split('T')[0],
      });
    } catch (error) {
      toast.error('Failed to add stock');
      console.error('Stock in error:', error);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Record Stock In</CardTitle>
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
                        {ingredient.name}
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

              <div className="space-y-2">
                <Label htmlFor="supplier">Supplier Name *</Label>
                <Input
                  id="supplier"
                  value={formData.supplier}
                  onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
                  placeholder="Enter supplier name"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="costPrice">Cost Price (₹) *</Label>
                <Input
                  id="costPrice"
                  type="number"
                  value={formData.costPrice}
                  onChange={(e) => setFormData({ ...formData, costPrice: e.target.value })}
                  placeholder="Enter cost price"
                  min="0"
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
                disabled={recordStockIn.isPending}
                className="bg-fresh-600 hover:bg-fresh-700"
              >
                {recordStockIn.isPending ? 'Recording...' : 'Record Stock In'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Stock In History</CardTitle>
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
