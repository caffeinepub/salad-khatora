import { useState } from 'react';
import { useActiveProducts } from '../hooks/useQueries';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import ProductDetailDialog from '../components/ProductDetailDialog';
import type { SaladBowl } from '../backend';

export default function UserMenuPage() {
  const { data: products, isLoading } = useActiveProducts();
  const [selectedProduct, setSelectedProduct] = useState<SaladBowl | null>(null);

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

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="relative rounded-xl overflow-hidden">
        <img
          src="/assets/generated/user-hero.dim_1200x400.png"
          alt="Fresh Salad Bowls"
          className="w-full h-64 md:h-80 object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent flex items-center">
          <div className="container px-8">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Fresh Salad Bowls
            </h1>
            <p className="text-xl text-white/90 max-w-xl">
              Healthy, delicious, and made fresh daily. Order now for quick delivery!
            </p>
          </div>
        </div>
      </div>

      {/* Menu Section */}
      <div>
        <h2 className="text-3xl font-bold mb-6">Our Menu</h2>
        
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i}>
                <Skeleton className="h-48 w-full" />
                <CardContent className="p-4 space-y-2">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-8 w-1/3" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : products && products.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <Card
                key={product.name}
                className="cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => setSelectedProduct(product)}
              >
                <div className="relative">
                  <img
                    src={getProductImage(product.bowlType)}
                    alt={product.name}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                  <Badge className="absolute top-2 right-2 bg-green-600">
                    Available
                  </Badge>
                </div>
                <CardContent className="p-4">
                  <h3 className="text-xl font-semibold mb-2">{product.name}</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    {getBowlSizeLabel(product.bowlType)}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-orange-600">
                      ₹{Number(product.price)}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">
              No products available at the moment. Please check back later!
            </p>
          </div>
        )}
      </div>

      {selectedProduct && (
        <ProductDetailDialog
          product={selectedProduct}
          open={!!selectedProduct}
          onOpenChange={(open) => !open && setSelectedProduct(null)}
        />
      )}
    </div>
  );
}
