import { useState } from 'react';
import { useGetInventoryStatus, useGetAllIngredients, useDeleteIngredient } from '../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Loader2, Trash2, Edit, Plus } from 'lucide-react';
import IngredientForm from './IngredientForm';
import EditIngredientDialog from './EditIngredientDialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

export default function StockStatusTab() {
  const { data: stockStatus, isLoading } = useGetInventoryStatus();
  const { data: ingredients } = useGetAllIngredients();
  const deleteIngredientMutation = useDeleteIngredient();
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingIngredient, setEditingIngredient] = useState<string | null>(null);
  const [ingredientToDelete, setIngredientToDelete] = useState<string | null>(null);

  const handleDelete = async () => {
    if (ingredientToDelete) {
      await deleteIngredientMutation.mutateAsync(ingredientToDelete);
      setIngredientToDelete(null);
    }
  };

  const availableStock = stockStatus?.filter((item) => item.quantityInStock > BigInt(0)) || [];
  const totalValue = availableStock.reduce(
    (sum, item) => sum + Number(item.quantityInStock) * Number(item.costPricePerUnit),
    0
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="w-8 h-8 animate-spin text-fresh-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold">Current Stock Status</h2>
          <p className="text-muted-foreground">Total Inventory Value: ₹{totalValue.toFixed(2)}</p>
        </div>
        <Button onClick={() => setShowAddForm(!showAddForm)} className="bg-fresh-600 hover:bg-fresh-700">
          <Plus className="w-4 h-4 mr-2" />
          {showAddForm ? 'Hide Form' : 'Add Ingredient'}
        </Button>
      </div>

      {showAddForm && (
        <div className="mb-6">
          <IngredientForm onSuccess={() => setShowAddForm(false)} />
        </div>
      )}

      {availableStock.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          No ingredients in stock. Add your first ingredient above.
        </div>
      ) : (
        <div className="bg-card rounded-lg border border-border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ingredient</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Unit</TableHead>
                <TableHead>Cost/Unit</TableHead>
                <TableHead>Total Value</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {availableStock.map((item) => {
                const totalItemValue = Number(item.quantityInStock) * Number(item.costPricePerUnit);
                return (
                  <TableRow
                    key={item.ingredientName}
                    className={item.isLowStock ? 'bg-orange-50 border-l-4 border-l-orange-500' : ''}
                  >
                    <TableCell className="font-medium">{item.ingredientName}</TableCell>
                    <TableCell>{item.quantityInStock.toString()}</TableCell>
                    <TableCell>{item.unitType}</TableCell>
                    <TableCell>₹{Number(item.costPricePerUnit)}</TableCell>
                    <TableCell>₹{totalItemValue.toFixed(2)}</TableCell>
                    <TableCell>
                      {item.isLowStock ? (
                        <span className="text-orange-600 font-medium">Low Stock</span>
                      ) : (
                        <span className="text-green-600">In Stock</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setEditingIngredient(item.ingredientName)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setIngredientToDelete(item.ingredientName)}
                          className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}

      {editingIngredient && (
        <EditIngredientDialog
          ingredientName={editingIngredient}
          open={!!editingIngredient}
          onOpenChange={(open) => !open && setEditingIngredient(null)}
        />
      )}

      <AlertDialog open={ingredientToDelete !== null} onOpenChange={() => setIngredientToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Ingredient</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this ingredient? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
