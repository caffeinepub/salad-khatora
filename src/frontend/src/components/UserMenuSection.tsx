import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useActiveProducts } from '../hooks/useQueries';
import { useCart } from '../contexts/CartContext';
import { toast } from 'sonner';
import { ShoppingCart, Leaf } from 'lucide-react';
import type { SaladBowl } from '../backend';

export default function UserMenuSection() {
  const { data: products, isLoading } = useActiveProducts();
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

  const getImageForBowl = (bowlType: string) => {
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

  const handleAddToCart = (product: SaladBowl) => {
    addItem(product, 1);
    toast.success(`${product.name} added to cart!`);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center space-y-4">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-orange-600 border-t-transparent mx-auto"></div>
          <p className="text-muted-foreground">Loading menu...</p>
        </div>
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="text-center py-12">
        <Leaf className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold mb-2">No items available</h3>
        <p className="text-muted-foreground">Check back soon for fresh salad bowls!</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Our Menu</h2>
        <p className="text-muted-foreground">Fresh, healthy salad bowls made to order</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <Card key={product.name} className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="aspect-square relative bg-gradient-to-br from-green-50 to-orange-50 dark:from-green-900/20 dark:to-orange-900/20">
              <img
                src={getImageForBowl(product.bowlType)}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              {product.active && (
                <Badge className="absolute top-2 right-2 bg-green-600">Available</Badge>
              )}
            </div>
            <CardContent className="p-4">
              <h3 className="font-bold text-lg mb-1">{product.name}</h3>
              <p className="text-sm text-muted-foreground mb-2">{getBowlSizeLabel(product.bowlType)}</p>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-orange-600">₹{Number(product.price)}</span>
                <Button
                  onClick={() => handleAddToCart(product)}
                  size="sm"
                  className="gap-2"
                >
                  <ShoppingCart className="h-4 w-4" />
                  Add to Cart
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
