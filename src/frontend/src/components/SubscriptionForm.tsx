import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { format, addDays } from 'date-fns';
import { useWeeklyPlanDuration, useMonthlyPlanDuration, useBowlSizes, useCreateSubscription } from '../hooks/useQueries';
import { SaladBowlType } from '../backend';

interface SubscriptionFormProps {
  onSuccess?: () => void;
}

export default function SubscriptionForm({ onSuccess }: SubscriptionFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    customerName: '',
    phoneNumber: '',
    planType: 'weekly',
    bowlSize: 'gm250',
    price: '',
    isPaid: false,
  });
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();

  const { data: weeklyDuration } = useWeeklyPlanDuration();
  const { data: monthlyDuration } = useMonthlyPlanDuration();
  const { data: bowlSizes } = useBowlSizes();
  const createSubscription = useCreateSubscription();

  // Auto-calculate end date when start date or plan type changes
  useEffect(() => {
    if (startDate && weeklyDuration && monthlyDuration) {
      const duration = formData.planType === 'weekly' ? weeklyDuration : monthlyDuration;
      setEndDate(addDays(startDate, duration));
    }
  }, [startDate, formData.planType, weeklyDuration, monthlyDuration]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!startDate || !endDate) {
      toast.error('Please select start and end dates');
      return;
    }

    try {
      const bowlSizeEnum = formData.bowlSize as keyof typeof SaladBowlType;
      const duration = formData.planType === 'weekly' ? weeklyDuration : monthlyDuration;
      
      await createSubscription.mutateAsync({
        id: BigInt(Date.now()),
        name: formData.name,
        customerName: formData.customerName,
        phoneNumber: formData.phoneNumber,
        planType: formData.planType === 'weekly' ? 'Weekly (6 days)' : 'Monthly (24 days)',
        bowlSize: SaladBowlType[bowlSizeEnum],
        price: BigInt(formData.price),
        isPaid: formData.isPaid,
        startDate: BigInt(startDate.getTime() * 1000000),
        endDate: BigInt(endDate.getTime() * 1000000),
        remainingDeliveries: BigInt(duration || 0),
      });

      toast.success('Subscription added successfully');
      setFormData({
        name: '',
        customerName: '',
        phoneNumber: '',
        planType: 'weekly',
        bowlSize: 'gm250',
        price: '',
        isPaid: false,
      });
      setStartDate(undefined);
      setEndDate(undefined);
      onSuccess?.();
    } catch (error) {
      toast.error('Failed to add subscription');
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">Subscription Name *</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="e.g., John's Weekly Plan"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="customerName">Customer Name *</Label>
          <Input
            id="customerName"
            value={formData.customerName}
            onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
            placeholder="Enter customer name"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phoneNumber">Phone Number *</Label>
          <Input
            id="phoneNumber"
            type="tel"
            value={formData.phoneNumber}
            onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
            placeholder="10-digit mobile number"
            required
            pattern="[0-9]{10}"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="planType">Plan Type *</Label>
          <Select value={formData.planType} onValueChange={(value) => setFormData({ ...formData, planType: value })}>
            <SelectTrigger id="planType">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="weekly">Weekly (6 days)</SelectItem>
              <SelectItem value="monthly">Monthly (24 days)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="bowlSize">Bowl Size *</Label>
          <Select value={formData.bowlSize} onValueChange={(value) => setFormData({ ...formData, bowlSize: value })}>
            <SelectTrigger id="bowlSize">
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
          <Label htmlFor="startDate">Start Date *</Label>
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
              <Calendar mode="single" selected={startDate} onSelect={setStartDate} initialFocus />
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-2">
          <Label htmlFor="endDate">End Date *</Label>
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
              <Calendar mode="single" selected={endDate} onSelect={setEndDate} initialFocus />
            </PopoverContent>
          </Popover>
          <p className="text-xs text-muted-foreground">
            Auto-calculated based on plan type
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="price">Price (₹) *</Label>
          <Input
            id="price"
            type="number"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            placeholder="Enter subscription price"
            required
            min="0"
          />
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="isPaid"
          checked={formData.isPaid}
          onCheckedChange={(checked) =>
            setFormData({ ...formData, isPaid: checked as boolean })
          }
        />
        <Label htmlFor="isPaid" className="text-sm font-normal cursor-pointer">
          Payment received
        </Label>
      </div>

      <Button 
        type="submit" 
        disabled={createSubscription.isPending} 
        className="w-full bg-fresh-600 hover:bg-fresh-700"
      >
        {createSubscription.isPending ? 'Adding...' : 'Add Subscription'}
      </Button>
    </form>
  );
}
