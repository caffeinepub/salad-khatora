import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAddCustomer } from '../hooks/useQueries';
import type { Customer } from '../backend';

export default function CustomerForm() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [preferences, setPreferences] = useState('');
  const [gender, setGender] = useState('');
  const [age, setAge] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');

  const addCustomerMutation = useAddCustomer();

  const calculateBMI = (weightKg: number, heightCm: number): number => {
    if (heightCm <= 0 || weightKg <= 0) return 0;
    const heightM = heightCm / 100;
    return weightKg / (heightM * heightM);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const weightKg = parseFloat(weight);
    const heightCm = parseFloat(height);
    const ageNum = parseInt(age);
    const bmi = calculateBMI(weightKg, heightCm);

    const customer: Customer = {
      id: BigInt(0),
      name,
      phone,
      email,
      address,
      preferences,
      gender,
      age: BigInt(ageNum),
      heightCm,
      weightKg,
      calculatedBMI: bmi,
    };

    await addCustomerMutation.mutateAsync(customer);

    // Reset form
    setName('');
    setPhone('');
    setEmail('');
    setAddress('');
    setPreferences('');
    setGender('');
    setAge('');
    setHeight('');
    setWeight('');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-card p-6 rounded-lg border border-border">
      <h2 className="text-xl font-semibold text-foreground">Add New Customer</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Name *</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder="Enter customer name"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Phone *</Label>
          <Input
            id="phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
            placeholder="Enter phone number"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter email address"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="gender">Gender *</Label>
          <Select value={gender} onValueChange={setGender} required>
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
          <Label htmlFor="age">Age *</Label>
          <Input
            id="age"
            type="number"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            required
            placeholder="Enter age"
            min="1"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="height">Height (cm) *</Label>
          <Input
            id="height"
            type="number"
            step="0.1"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            required
            placeholder="Enter height in cm"
            min="1"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="weight">Weight (kg) *</Label>
          <Input
            id="weight"
            type="number"
            step="0.1"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            required
            placeholder="Enter weight in kg"
            min="1"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="address">Address</Label>
        <Textarea
          id="address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Enter delivery address"
          rows={2}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="preferences">Dietary Preferences</Label>
        <Textarea
          id="preferences"
          value={preferences}
          onChange={(e) => setPreferences(e.target.value)}
          placeholder="Enter dietary preferences or restrictions"
          rows={2}
        />
      </div>

      <Button
        type="submit"
        disabled={addCustomerMutation.isPending}
        className="w-full bg-fresh-600 hover:bg-fresh-700"
      >
        {addCustomerMutation.isPending ? 'Adding Customer...' : 'Add Customer'}
      </Button>
    </form>
  );
}
