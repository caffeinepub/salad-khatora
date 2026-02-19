import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { useUpdateProduct, useBowlSizes } from '../hooks/useQueries';
import { SaladBowl, SaladBowlType } from '../backend';

interface EditProductDialogProps {
  product: SaladBowl;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function EditProductDialog({ product, open, onOpenChange }: EditProductDialogProps) {
  const updateProduct = useUpdateProduct();
  const { data: bowlSizes } = useBowlSizes();

  const [formData, setFormData] = useState({
    name: product.name,
    bowlType: product.bowlType,
    price: product.price.toString(),
    active: product.active,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const price = parseInt(formData.price);
    if (isNaN(price) || price <= 0) {
      toast.error('Please enter a valid price');
      return;
    }

    try {
      await updateProduct.mutateAsync({
        name: product.name,
        updatedProduct: {
          name: formData.name,
          bowlType: formData.bowlType,
          price: BigInt(price),
          active: formData.active,
          recipe: product.recipe,
        },
      });

      toast.success('Product updated successfully');
      onOpenChange(false);
    } catch (error) {
      toast.error('Failed to update product');
      console.error(error);
    }
  };

  const getBowlSizeKey = (bowlSize: SaladBowlType): string => {
    switch (bowlSize) {
      case SaladBowlType.gm250:
        return 'gm250';
      case SaladBowlType.gm350:
        return 'gm350';
      case SaladBowlType.gm500:
        return 'gm500';
      case SaladBowlType.custom:
        return 'custom';
      default:
        return 'gm250';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Product</DialogTitle>
          <DialogDescription>
            Update product details for {product.name}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="edit-product-name">Product Name *</Label>
            <Input
              id="edit-product-name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Classic Garden Bowl"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-bowl-type">Bowl Size *</Label>
            <Select 
              value={getBowlSizeKey(formData.bowlType)} 
              onValueChange={(value) => setFormData({ ...formData, bowlType: SaladBowlType[value as keyof typeof SaladBowlType] })}
            >
              <SelectTrigger id="edit-bowl-type">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {bowlSizes?.gm250 && <SelectItem value="gm250">250gm Bowl</SelectItem>}
                {bowlSizes?.gm350 && <SelectItem value="gm350">350gm Bowl</SelectItem>}
                {bowlSizes?.gm500 && <SelectItem value="gm500">500gm Bowl</SelectItem>}
                <SelectItem value="custom">Custom Bowl</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-price">Price (₹) *</Label>
            <Input
              id="edit-price"
              type="number"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              placeholder="Enter product price"
              required
              min="0"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="edit-active"
              checked={formData.active}
              onCheckedChange={(checked) =>
                setFormData({ ...formData, active: checked })
              }
            />
            <Label htmlFor="edit-active" className="text-sm font-normal cursor-pointer">
              Product is available
            </Label>
          </div>

          <div className="flex gap-2 justify-end pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={updateProduct.isPending}
              className="bg-fresh-600 hover:bg-fresh-700"
            >
              {updateProduct.isPending ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
