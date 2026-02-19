import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Edit, Trash2, ChefHat } from 'lucide-react';
import { toast } from 'sonner';
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
import { useToggleProductAvailability, useAllProducts, useDeleteProduct } from '../hooks/useQueries';
import EditRecipeDialog from './EditRecipeDialog';
import EditProductDialog from './EditProductDialog';
import type { SaladBowl } from '../backend';

export default function ProductList() {
  const { data: products = [], isLoading } = useAllProducts();
  const [editingRecipe, setEditingRecipe] = useState<{ name: string; recipe: { ingredient: string; quantity: number }[] } | null>(null);
  const [editingProduct, setEditingProduct] = useState<SaladBowl | null>(null);
  const [deletingProduct, setDeletingProduct] = useState<SaladBowl | null>(null);
  
  const toggleAvailability = useToggleProductAvailability();
  const deleteProduct = useDeleteProduct();

  const handleToggleAvailability = async (productName: string, currentStatus: boolean) => {
    const newStatus = !currentStatus;

    try {
      await toggleAvailability.mutateAsync({ bowlName: productName, isAvailable: newStatus });
      toast.success(`${productName} is now ${newStatus ? 'available' : 'unavailable'}`);
    } catch (error) {
      toast.error('Failed to update availability');
    }
  };

  const handleDeleteProduct = async () => {
    if (!deletingProduct) return;

    try {
      await deleteProduct.mutateAsync(deletingProduct.name);
      toast.success(`${deletingProduct.name} deleted successfully`);
      setDeletingProduct(null);
    } catch (error) {
      toast.error('Failed to delete product');
    }
  };

  const handleEditRecipe = (product: SaladBowl) => {
    // Convert backend Recipe format [string, bigint][] to frontend format
    const recipeItems = product.recipe.map(([ingredient, quantity]) => ({
      ingredient,
      quantity: Number(quantity),
    }));
    
    setEditingRecipe({
      name: product.name,
      recipe: recipeItems,
    });
  };

  if (isLoading) {
    return <div className="text-center py-8">Loading products...</div>;
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No products available. Add your first product to get started.
      </div>
    );
  }

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <Card key={product.name} className={!product.active ? 'opacity-60' : ''}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg">{product.name}</CardTitle>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant="outline">{product.bowlType}</Badge>
                    <Badge className="bg-fresh-100 dark:bg-fresh-900/20 text-fresh-700 dark:text-fresh-400 border-fresh-200 dark:border-fresh-800">
                      ₹{Number(product.price)}
                    </Badge>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={product.active}
                    onCheckedChange={() => handleToggleAvailability(product.name, product.active)}
                    disabled={toggleAvailability.isPending}
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2">Recipe:</p>
                <div className="space-y-1">
                  {product.recipe.map((item, idx) => (
                    <div key={idx} className="flex justify-between text-sm">
                      <span>{item[0]}</span>
                      <span className="text-muted-foreground">{Number(item[1])}g</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1"
                  onClick={() => handleEditRecipe(product)}
                >
                  <ChefHat className="h-4 w-4 mr-1" />
                  Edit Recipe
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setEditingProduct(product)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setDeletingProduct(product)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>

              <div className="pt-2 border-t">
                <Badge variant={product.active ? 'default' : 'secondary'} className="w-full justify-center">
                  {product.active ? 'Available' : 'Not Available'}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {editingRecipe && (
        <EditRecipeDialog
          product={editingRecipe}
          open={!!editingRecipe}
          onOpenChange={(open) => !open && setEditingRecipe(null)}
          onSuccess={() => {
            setEditingRecipe(null);
            toast.success('Recipe updated successfully');
          }}
        />
      )}

      {editingProduct && (
        <EditProductDialog
          product={editingProduct}
          open={!!editingProduct}
          onOpenChange={(open) => !open && setEditingProduct(null)}
        />
      )}

      <AlertDialog open={!!deletingProduct} onOpenChange={(open) => !open && setDeletingProduct(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Product</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{deletingProduct?.name}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteProduct}
              disabled={deleteProduct.isPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteProduct.isPending ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
