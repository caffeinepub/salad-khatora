import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { format, addDays } from 'date-fns';
import { toast } from 'sonner';
import { useEditSubscription, useWeeklyPlanDuration, useMonthlyPlanDuration, useBowlSizes } from '../hooks/useQueries';
import { SaladBowlType, Subscription } from '../backend';

interface EditSubscriptionDialogProps {
  subscription: Subscription;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function EditSubscriptionDialog({ subscription, open, onOpenChange }: EditSubscriptionDialogProps) {
  const editSubscription = useEditSubscription();
  const { data: weeklyDuration } = useWeeklyPlanDuration();
  const { data: monthlyDuration } = useMonthlyPlanDuration();
  const { data: bowlSizes } = useBowlSizes();

  const [formData, setFormData] = useState({
    name: subscription.name,
    customerName: subscription.customerName,
    phoneNumber: subscription.phoneNumber,
    planType: subscription.planType.includes('Weekly') ? 'weekly' : 'monthly',
    bowlSize: subscription.bowlSize,
    price: subscription.price.toString(),
    isPaid: subscription.isPaid,
    remainingDeliveries: subscription.remainingDeliveries.toString(),
  });

  const [startDate, setStartDate] = useState<Date>(new Date(Number(subscription.startDate) / 1000000));
  const [endDate, setEndDate] = useState<Date>(new Date(Number(subscription.endDate) / 1000000));

  // Auto-calculate end date when start date or plan type changes
  useEffect(() => {
    if (startDate && weeklyDuration && monthlyDuration) {
      const duration = formData.planType === 'weekly' ? weeklyDuration : monthlyDuration;
      setEndDate(addDays(startDate, duration));
    }
  }, [startDate, formData.planType, weeklyDuration, monthlyDuration]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await editSubscription.mutateAsync({
        id: subscription.id,
        name: formData.name,
        customerName: formData.customerName,
        phoneNumber: formData.phoneNumber,
        planType: formData.planType === 'weekly' ? 'Weekly (6 days)' : 'Monthly (24 days)',
        bowlSize: formData.bowlSize,
        price: BigInt(formData.price),
        isPaid: formData.isPaid,
        startDate: BigInt(startDate.getTime() * 1000000),
        endDate: BigInt(endDate.getTime() * 1000000),
        remainingDeliveries: BigInt(formData.remainingDeliveries),
      });

      toast.success('Subscription updated successfully');
      onOpenChange(false);
    } catch (error) {
      toast.error('Failed to update subscription');
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
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Subscription</DialogTitle>
          <DialogDescription>
            Update subscription details for {subscription.customerName}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Subscription Name *</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., John's Weekly Plan"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-customerName">Customer Name *</Label>
              <Input
                id="edit-customerName"
                value={formData.customerName}
                onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                placeholder="Enter customer name"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-phoneNumber">Phone Number *</Label>
              <Input
                id="edit-phoneNumber"
                type="tel"
                value={formData.phoneNumber}
                onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                placeholder="10-digit mobile number"
                required
                pattern="[0-9]{10}"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-planType">Plan Type *</Label>
              <Select value={formData.planType} onValueChange={(value) => setFormData({ ...formData, planType: value })}>
                <SelectTrigger id="edit-planType">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="weekly">Weekly (6 days)</SelectItem>
                  <SelectItem value="monthly">Monthly (24 days)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-bowlSize">Bowl Size *</Label>
              <Select 
                value={getBowlSizeKey(formData.bowlSize)} 
                onValueChange={(value) => setFormData({ ...formData, bowlSize: SaladBowlType[value as keyof typeof SaladBowlType] })}
              >
                <SelectTrigger id="edit-bowlSize">
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
              <Label htmlFor="edit-startDate">Start Date *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {startDate ? format(startDate, 'PPP') : 'Pick a date'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={startDate} onSelect={(date) => date && setStartDate(date)} initialFocus />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-endDate">End Date *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {endDate ? format(endDate, 'PPP') : 'Auto-calculated'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={endDate} onSelect={(date) => date && setEndDate(date)} initialFocus />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-price">Price (₹) *</Label>
              <Input
                id="edit-price"
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                placeholder="Enter subscription price"
                required
                min="0"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-remainingDeliveries">Remaining Deliveries *</Label>
              <Input
                id="edit-remainingDeliveries"
                type="number"
                value={formData.remainingDeliveries}
                onChange={(e) => setFormData({ ...formData, remainingDeliveries: e.target.value })}
                placeholder="Number of deliveries left"
                required
                min="0"
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="edit-isPaid"
              checked={formData.isPaid}
              onCheckedChange={(checked) =>
                setFormData({ ...formData, isPaid: checked as boolean })
              }
            />
            <Label htmlFor="edit-isPaid" className="text-sm font-normal cursor-pointer">
              Payment received
            </Label>
          </div>

          <div className="flex gap-2 justify-end pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={editSubscription.isPending}
              className="bg-fresh-600 hover:bg-fresh-700"
            >
              {editSubscription.isPending ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
