import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, AlertTriangle } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
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
import { useAllIngredients, useDeleteIngredient } from '../hooks/useQueries';
import EditIngredientDialog from './EditIngredientDialog';
import type { Ingredient } from '../backend';

export default function IngredientList() {
  const { data: ingredients = [], isLoading } = useAllIngredients();
  const deleteIngredient = useDeleteIngredient();
  const [editingIngredient, setEditingIngredient] = useState<Ingredient | null>(null);
  const [deletingIngredient, setDeletingIngredient] = useState<Ingredient | null>(null);

  const totalValue = ingredients.reduce(
    (sum, item) => sum + Number(item.quantity) * Number(item.costPricePerUnit),
    0
  );

  const handleDelete = async () => {
    if (!deletingIngredient) return;
    
    try {
      await deleteIngredient.mutateAsync(deletingIngredient.name);
      setDeletingIngredient(null);
    } catch (error) {
      console.error('Failed to delete ingredient:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Loading ingredients...</CardTitle>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Total Inventory Value</CardTitle>
            <div className="text-2xl font-bold text-fresh-600">₹{totalValue.toLocaleString()}</div>
          </div>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Ingredients</CardTitle>
        </CardHeader>
        <CardContent>
          {ingredients.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No ingredients added yet. Add your first ingredient to get started.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Cost/Unit</TableHead>
                    <TableHead>Total Value</TableHead>
                    <TableHead>Supplier</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {ingredients.map((ingredient, index) => {
                    const quantity = Number(ingredient.quantity);
                    const costPerUnit = Number(ingredient.costPricePerUnit);
                    const threshold = Number(ingredient.lowStockThreshold);
                    const isLowStock = quantity < threshold;
                    const totalValue = quantity * costPerUnit;

                    return (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{ingredient.name}</TableCell>
                        <TableCell>
                          {quantity} grams
                        </TableCell>
                        <TableCell>₹{costPerUnit}</TableCell>
                        <TableCell>₹{totalValue.toFixed(2)}</TableCell>
                        <TableCell>{ingredient.supplierName}</TableCell>
                        <TableCell>
                          {isLowStock ? (
                            <Badge variant="destructive" className="gap-1">
                              <AlertTriangle className="h-3 w-3" />
                              Low Stock
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="bg-fresh-50 dark:bg-fresh-900/20 text-fresh-700 dark:text-fresh-400 border-fresh-200 dark:border-fresh-800">
                              In Stock
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => setEditingIngredient(ingredient)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => setDeletingIngredient(ingredient)}
                            >
                              <Trash2 className="h-4 w-4" />
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
        </CardContent>
      </Card>

      {editingIngredient && (
        <EditIngredientDialog
          ingredient={editingIngredient}
          open={!!editingIngredient}
          onOpenChange={(open) => !open && setEditingIngredient(null)}
        />
      )}

      <AlertDialog open={!!deletingIngredient} onOpenChange={(open) => !open && setDeletingIngredient(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Ingredient</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete <strong>{deletingIngredient?.name}</strong>? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
