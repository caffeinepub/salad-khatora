import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { useBowlSizes } from '../hooks/useQueries';

interface IngredientRecipe {
  ingredientName: string;
  quantity: string;
}

interface ProductFormProps {
  onSuccess?: () => void;
}

export default function ProductForm({ onSuccess }: ProductFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    bowlType: '250gm',
    price: '',
    active: true,
  });
  const [recipe, setRecipe] = useState<IngredientRecipe[]>([{ ingredientName: '', quantity: '' }]);

  const { data: bowlSizes } = useBowlSizes();

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
    setIsSubmitting(true);

    try {
      // TODO: Call backend API once available
      // await actor.addSaladBowl({...formData, recipe});
      
      toast.success('Product added successfully');
      setFormData({ name: '', bowlType: '250gm', price: '', active: true });
      setRecipe([{ ingredientName: '', quantity: '' }]);
      onSuccess?.();
    } catch (error) {
      toast.error('Failed to add product');
    } finally {
      setIsSubmitting(false);
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
          <Select value={formData.bowlType} onValueChange={(value) => setFormData({ ...formData, bowlType: value })}>
            <SelectTrigger id="bowlType">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {bowlSizes?.gm250 && <SelectItem value="250gm">250gm Bowl</SelectItem>}
              {bowlSizes?.gm350 && <SelectItem value="350gm">350gm Bowl</SelectItem>}
              {bowlSizes?.gm500 && <SelectItem value="500gm">500gm Bowl</SelectItem>}
              <SelectItem value="custom">Custom Bowl</SelectItem>
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
            <CardTitle className="text-lg">Recipe Ingredients</CardTitle>
            <Button type="button" variant="outline" size="sm" onClick={addIngredient}>
              <Plus className="h-4 w-4 mr-1" />
              Add Ingredient
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {recipe.map((item, index) => (
            <div key={index} className="flex gap-2">
              <div className="flex-1">
                <Input
                  placeholder="Ingredient name"
                  value={item.ingredientName}
                  onChange={(e) => updateIngredient(index, 'ingredientName', e.target.value)}
                  required
                />
              </div>
              <div className="w-32">
                <Input
                  type="number"
                  placeholder="Quantity (g)"
                  value={item.quantity}
                  onChange={(e) => updateIngredient(index, 'quantity', e.target.value)}
                  required
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
        </CardContent>
      </Card>

      <Button type="submit" disabled={isSubmitting} className="w-full bg-fresh-600 hover:bg-fresh-700">
        {isSubmitting ? 'Adding...' : 'Add Product'}
      </Button>
    </form>
  );
}
