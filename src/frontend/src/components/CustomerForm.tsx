import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAddCustomer } from '../hooks/useQueries';
import { toast } from 'sonner';

interface CustomerFormProps {
  onSuccess?: () => void;
}

export default function CustomerForm({ onSuccess }: CustomerFormProps) {
  const addCustomer = useAddCustomer();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    preferences: '',
    gender: '',
    age: '',
    heightCm: '',
    weightKg: '',
  });

  const calculateBMI = (weight: number, height: number): number => {
    if (height <= 0 || weight <= 0) return 0;
    const heightInMeters = height / 100;
    return weight / (heightInMeters * heightInMeters);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required fields
    if (!formData.name.trim()) {
      toast.error('Please enter customer name');
      return;
    }

    if (!formData.phone.trim()) {
      toast.error('Please enter phone number');
      return;
    }

    // Validate email format if provided
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    // Parse numeric fields
    const age = formData.age ? parseInt(formData.age) : 0;
    const heightCm = formData.heightCm ? parseFloat(formData.heightCm) : 0;
    const weightKg = formData.weightKg ? parseFloat(formData.weightKg) : 0;

    // Validate numeric fields
    if (formData.age && (isNaN(age) || age < 0 || age > 150)) {
      toast.error('Please enter a valid age');
      return;
    }

    if (formData.heightCm && (isNaN(heightCm) || heightCm <= 0)) {
      toast.error('Please enter a valid height');
      return;
    }

    if (formData.weightKg && (isNaN(weightKg) || weightKg <= 0)) {
      toast.error('Please enter a valid weight');
      return;
    }

    // Calculate BMI
    const calculatedBMI = calculateBMI(weightKg, heightCm);

    try {
      await addCustomer.mutateAsync({
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        address: formData.address,
        preferences: formData.preferences,
        gender: formData.gender || '',
        age: BigInt(age),
        heightCm,
        weightKg,
        calculatedBMI,
      });

      // Reset form
      setFormData({
        name: '',
        phone: '',
        email: '',
        address: '',
        preferences: '',
        gender: '',
        age: '',
        heightCm: '',
        weightKg: '',
      });

      onSuccess?.();
    } catch (error: any) {
      console.error('Failed to add customer:', error);
      toast.error(error.message || 'Failed to add customer');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">Name *</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Enter customer name"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Mobile Number *</Label>
          <Input
            id="phone"
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            placeholder="Enter mobile number"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="Enter email address"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="gender">Gender</Label>
          <Select value={formData.gender} onValueChange={(value) => setFormData({ ...formData, gender: value })}>
            <SelectTrigger id="gender">
              <SelectValue placeholder="Select gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Male">Male</SelectItem>
              <SelectItem value="Female">Female</SelectItem>
              <SelectItem value="Other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="age">Age</Label>
          <Input
            id="age"
            type="number"
            value={formData.age}
            onChange={(e) => setFormData({ ...formData, age: e.target.value })}
            placeholder="Enter age"
            min="0"
            max="150"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="heightCm">Height (cm)</Label>
          <Input
            id="heightCm"
            type="number"
            step="0.1"
            value={formData.heightCm}
            onChange={(e) => setFormData({ ...formData, heightCm: e.target.value })}
            placeholder="Enter height in cm"
            min="0"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="weightKg">Weight (kg)</Label>
          <Input
            id="weightKg"
            type="number"
            step="0.1"
            value={formData.weightKg}
            onChange={(e) => setFormData({ ...formData, weightKg: e.target.value })}
            placeholder="Enter weight in kg"
            min="0"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="address">Address</Label>
        <Textarea
          id="address"
          value={formData.address}
          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
          placeholder="Enter delivery address"
          rows={2}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="preferences">Dietary Preferences</Label>
        <Textarea
          id="preferences"
          value={formData.preferences}
          onChange={(e) => setFormData({ ...formData, preferences: e.target.value })}
          placeholder="e.g., Vegan, No nuts, Extra protein"
          rows={2}
        />
      </div>

      <div className="flex justify-end pt-4">
        <Button 
          type="submit" 
          disabled={addCustomer.isPending}
          className="bg-fresh-600 hover:bg-fresh-700"
        >
          {addCustomer.isPending ? 'Adding Customer...' : 'Add Customer'}
        </Button>
      </div>
    </form>
  );
}
