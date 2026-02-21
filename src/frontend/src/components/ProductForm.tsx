import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { useBowlSizes, useAllIngredients, useAddProduct } from '../hooks/useQueries';
import { SaladBowlType } from '../backend';

interface IngredientRecipe {
  ingredientName: string;
  quantity: string;
}

interface ProductFormProps {
  onSuccess?: () => void;
}

export default function ProductForm({ onSuccess }: ProductFormProps) {
  const { data: bowlSizes } = useBowlSizes();
  const { data: ingredients = [] } = useAllIngredients();
  const addProduct = useAddProduct();

  const [formData, setFormData] = useState({
    name: '',
    bowlType: 'gm250' as SaladBowlType,
    price: '',
    active: true,
  });
  const [recipe, setRecipe] = useState<IngredientRecipe[]>([{ ingredientName: '', quantity: '' }]);

  const addIngredient = () => {
    setRecipe([...recipe, { ingredientName: '', quantity: '' }]);
  };

  const removeIngredient = (index: number) => {
    setRecipe(recipe.filter((_, i) => i !== index));
  };

  const updateIngredient = (index: number, field: keyof IngredientRecipe, value: string) => {
    const updated = [...recipe];
    updated[index][field] = value;
    setRecipe(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    if (!formData.name.trim()) {
      toast.error('Please enter a product name');
      return;
    }

    const price = parseInt(formData.price);
    if (isNaN(price) || price <= 0) {
      toast.error('Please enter a valid price');
      return;
    }

    // Validate recipe
    const validRecipe = recipe.filter(r => r.ingredientName && r.quantity);
    if (validRecipe.length === 0) {
      toast.error('Please add at least one ingredient to the recipe');
      return;
    }

    // Convert recipe to backend format
    const recipeArray: Array<[string, bigint]> = validRecipe.map(r => [
      r.ingredientName,
      BigInt(parseInt(r.quantity) || 0)
    ]);

    try {
      await addProduct.mutateAsync({
        name: formData.name,
        bowlType: formData.bowlType,
        price: BigInt(price),
        recipe: recipeArray,
        active: formData.active,
      });

      // Reset form
      setFormData({ name: '', bowlType: SaladBowlType.gm250, price: '', active: true });
      setRecipe([{ ingredientName: '', quantity: '' }]);
      onSuccess?.();
    } catch (error) {
      console.error('Failed to add product:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">Product Name *</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="e.g., Classic Garden Bowl"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="bowlType">Bowl Type *</Label>
          <Select 
            value={formData.bowlType} 
            onValueChange={(value) => setFormData({ ...formData, bowlType: value as SaladBowlType })}
          >
            <SelectTrigger id="bowlType">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {bowlSizes?.gm250 && <SelectItem value={SaladBowlType.gm250}>250gm Bowl</SelectItem>}
              {bowlSizes?.gm350 && <SelectItem value={SaladBowlType.gm350}>350gm Bowl</SelectItem>}
              {bowlSizes?.gm500 && <SelectItem value={SaladBowlType.gm500}>500gm Bowl</SelectItem>}
              <SelectItem value={SaladBowlType.custom}>Custom Bowl</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="price">Selling Price (₹) *</Label>
          <Input
            id="price"
            type="number"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            placeholder="e.g., 150"
            required
            min="0"
          />
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Recipe Configuration</CardTitle>
            <Button type="button" variant="outline" size="sm" onClick={addIngredient}>
              <Plus className="mr-2 h-4 w-4" />
              Add Ingredient
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {recipe.map((item, index) => (
            <div key={index} className="flex gap-4 items-end">
              <div className="flex-1 space-y-2">
                <Label htmlFor={`ingredient-${index}`}>Ingredient</Label>
                <Select
                  value={item.ingredientName}
                  onValueChange={(value) => updateIngredient(index, 'ingredientName', value)}
                >
                  <SelectTrigger id={`ingredient-${index}`}>
                    <SelectValue placeholder="Select ingredient" />
                  </SelectTrigger>
                  <SelectContent>
                    {ingredients.map((ingredient) => (
                      <SelectItem key={ingredient.name} value={ingredient.name}>
                        {ingredient.name} ({ingredient.unitType})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="w-32 space-y-2">
                <Label htmlFor={`quantity-${index}`}>Quantity</Label>
                <Input
                  id={`quantity-${index}`}
                  type="number"
                  value={item.quantity}
                  onChange={(e) => updateIngredient(index, 'quantity', e.target.value)}
                  placeholder="0"
                  min="0"
                />
              </div>

              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => removeIngredient(index)}
                disabled={recipe.length === 1}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="flex justify-end gap-4">
        <Button 
          type="submit" 
          disabled={addProduct.isPending}
          className="bg-fresh-600 hover:bg-fresh-700"
        >
          {addProduct.isPending ? 'Adding Product...' : 'Add Product'}
        </Button>
      </div>
    </form>
  );
}
