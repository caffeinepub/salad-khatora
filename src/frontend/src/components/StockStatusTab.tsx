import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, AlertTriangle, Plus } from 'lucide-react';
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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useStockStatus, useDeleteIngredient } from '../hooks/useQueries';
import EditIngredientDialog from './EditIngredientDialog';
import IngredientForm from './IngredientForm';
import type { Ingredient } from '../backend';

export default function StockStatusTab() {
  const { data: stockStatus = [], isLoading } = useStockStatus();
  const deleteIngredient = useDeleteIngredient();
  const [editingIngredient, setEditingIngredient] = useState<Ingredient | null>(null);
  const [deletingIngredient, setDeletingIngredient] = useState<Ingredient | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  // Filter to show only available stock (quantity > 0)
  const availableStock = stockStatus.filter(item => Number(item.currentQuantity) > 0);

  const totalValue = availableStock.reduce(
    (sum, item) => sum + Number(item.currentQuantity) * Number(item.costPricePerUnit),
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
            <CardTitle>Loading stock status...</CardTitle>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Card className="flex-1 mr-4">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Total Inventory Value</CardTitle>
              <div className="text-2xl font-bold text-fresh-600">₹{totalValue.toLocaleString()}</div>
            </div>
          </CardHeader>
        </Card>
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-fresh-600 hover:bg-fresh-700">
              <Plus className="mr-2 h-4 w-4" />
              Add Ingredient
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Ingredient</DialogTitle>
            </DialogHeader>
            <IngredientForm onSuccess={() => setIsAddDialogOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Current Stock Status</CardTitle>
        </CardHeader>
        <CardContent>
          {availableStock.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No ingredients in stock. Add ingredients to get started.
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
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {availableStock.map((item, index) => {
                    const quantity = Number(item.currentQuantity);
                    const costPerUnit = Number(item.costPricePerUnit);
                    const totalValue = quantity * costPerUnit;

                    return (
                      <TableRow 
                        key={index}
                        className={item.isLowStock ? 'bg-orange-50 dark:bg-orange-950/20 border-l-4 border-l-orange-500' : ''}
                      >
                        <TableCell className="font-medium">{item.ingredientName}</TableCell>
                        <TableCell>
                          {quantity} {item.unitType}
                        </TableCell>
                        <TableCell>₹{costPerUnit}</TableCell>
                        <TableCell>₹{totalValue.toFixed(2)}</TableCell>
                        <TableCell>
                          {item.isLowStock ? (
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
                              onClick={() => setEditingIngredient({
                                name: item.ingredientName,
                                quantity: item.currentQuantity,
                                costPricePerUnit: item.costPricePerUnit,
                                supplierName: '',
                                lowStockThreshold: BigInt(0),
                                unitType: item.unitType,
                              })}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => setDeletingIngredient({
                                name: item.ingredientName,
                                quantity: item.currentQuantity,
                                costPricePerUnit: item.costPricePerUnit,
                                supplierName: '',
                                lowStockThreshold: BigInt(0),
                                unitType: item.unitType,
                              })}
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
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete {deletingIngredient?.name} from your inventory.
              This action cannot be undone.
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
