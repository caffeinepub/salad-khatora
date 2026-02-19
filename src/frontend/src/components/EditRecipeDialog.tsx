import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { useEditRecipe } from '../hooks/useQueries';
import type { Recipe } from '../backend';

interface RecipeItem {
  ingredient: string;
  quantity: number;
}

interface EditRecipeDialogProps {
  product: {
    name: string;
    recipe: RecipeItem[];
  };
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export default function EditRecipeDialog({ product, open, onOpenChange, onSuccess }: EditRecipeDialogProps) {
  const [recipe, setRecipe] = useState<RecipeItem[]>([]);
  const editRecipe = useEditRecipe();

  useEffect(() => {
    if (product) {
      setRecipe([...product.recipe]);
    }
  }, [product]);

  const addIngredient = () => {
    setRecipe([...recipe, { ingredient: '', quantity: 0 }]);
  };

  const removeIngredient = (index: number) => {
    setRecipe(recipe.filter((_, i) => i !== index));
  };

  const updateIngredient = (index: number, field: keyof RecipeItem, value: string | number) => {
    const updated = [...recipe];
    if (field === 'ingredient') {
      updated[index].ingredient = value as string;
    } else {
      updated[index].quantity = Number(value);
    }
    setRecipe(updated);
  };

  const handleSave = async () => {
    if (recipe.some(item => !item.ingredient || item.quantity <= 0)) {
      toast.error('Please fill all ingredient fields with valid values');
      return;
    }

    try {
      const backendRecipe: Recipe = recipe.map(item => [item.ingredient, BigInt(item.quantity)]);
      await editRecipe.mutateAsync({ bowlName: product.name, newRecipe: backendRecipe });
      onSuccess?.();
    } catch (error) {
      toast.error('Failed to update recipe');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Recipe - {product.name}</DialogTitle>
          <DialogDescription>
            Modify the ingredients and quantities for this salad bowl.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {recipe.map((item, index) => (
            <div key={index} className="flex gap-2 items-end">
              <div className="flex-1 space-y-2">
                <Label htmlFor={`ingredient-${index}`}>Ingredient</Label>
                <Input
                  id={`ingredient-${index}`}
                  placeholder="e.g., Lettuce"
                  value={item.ingredient}
                  onChange={(e) => updateIngredient(index, 'ingredient', e.target.value)}
                />
              </div>
              <div className="w-32 space-y-2">
                <Label htmlFor={`quantity-${index}`}>Quantity (g)</Label>
                <Input
                  id={`quantity-${index}`}
                  type="number"
                  placeholder="0"
                  value={item.quantity || ''}
                  onChange={(e) => updateIngredient(index, 'quantity', e.target.value)}
                  min="0"
                />
              </div>
              {recipe.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeIngredient(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addIngredient}
            className="w-full"
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Ingredient
          </Button>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleSave} 
            disabled={editRecipe.isPending}
            className="bg-fresh-600 hover:bg-fresh-700"
          >
            {editRecipe.isPending ? 'Saving...' : 'Save Changes'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
