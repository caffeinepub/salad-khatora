import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Minus, Plus } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import type { SaladBowl } from '../backend';
import { toast } from 'sonner';

interface ProductDetailDialogProps {
  product: SaladBowl;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function ProductDetailDialog({ product, open, onOpenChange }: ProductDetailDialogProps) {
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCart();

  const getBowlSizeLabel = (bowlType: string) => {
    switch (bowlType) {
      case 'gm250':
        return '250gm';
      case 'gm350':
        return '350gm';
      case 'gm500':
        return '500gm';
      default:
        return 'Custom';
    }
  };

  const getProductImage = (bowlType: string) => {
    switch (bowlType) {
      case 'gm250':
        return '/assets/generated/salad-250gm.dim_400x400.png';
      case 'gm350':
        return '/assets/generated/salad-350gm.dim_400x400.png';
      case 'gm500':
        return '/assets/generated/salad-500gm.dim_400x400.png';
      default:
        return '/assets/generated/salad-250gm.dim_400x400.png';
    }
  };

  const handleAddToCart = () => {
    addItem(product, quantity);
    toast.success(`Added ${quantity} ${product.name} to cart`);
    onOpenChange(false);
    setQuantity(1);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{product.name}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="relative">
            <img
              src={getProductImage(product.bowlType)}
              alt={product.name}
              className="w-full h-64 object-cover rounded-lg"
            />
            <Badge className="absolute top-2 right-2 bg-green-600">
              Available
            </Badge>
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-2">Bowl Size</h3>
              <p className="text-muted-foreground">{getBowlSizeLabel(product.bowlType)}</p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Price</h3>
              <p className="text-3xl font-bold text-orange-600">₹{Number(product.price)}</p>
            </div>

            {product.recipe && product.recipe.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-2">Ingredients</h3>
                <div className="grid grid-cols-2 gap-2">
                  {product.recipe.map(([ingredient, qty]) => (
                    <div key={ingredient} className="flex justify-between p-2 bg-muted rounded">
                      <span>{ingredient}</span>
                      <span className="text-muted-foreground">{Number(qty)}g</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div>
              <h3 className="text-lg font-semibold mb-2">Quantity</h3>
              <div className="flex items-center gap-4">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="text-xl font-semibold w-12 text-center">{quantity}</span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(quantity + 1)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t">
              <div>
                <p className="text-sm text-muted-foreground">Total</p>
                <p className="text-2xl font-bold">₹{Number(product.price) * quantity}</p>
              </div>
              <Button size="lg" onClick={handleAddToCart}>
                Add to Cart
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
