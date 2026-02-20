import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useGetCallerUserProfile, useSaveCallerUserProfile } from '../hooks/useQueries';
import { toast } from 'sonner';
import { MapPin, User, Phone, Mail, Home, Heart } from 'lucide-react';
import { calculateBMI, getBMICategory, getBMICategoryColor } from '../utils/bmiCalculator';

export default function UserProfileSection() {
  const { data: userProfile, isLoading, isFetched } = useGetCallerUserProfile();
  const saveProfileMutation = useSaveCallerUserProfile();

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

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [bmi, setBmi] = useState(0);

  useEffect(() => {
    if (userProfile) {
      setFormData({
        name: userProfile.name || '',
        phone: userProfile.phone || '',
        email: userProfile.email || '',
        address: userProfile.address || '',
        preferences: userProfile.preferences || '',
        gender: userProfile.gender || '',
        age: userProfile.age ? String(userProfile.age) : '',
        heightCm: userProfile.heightCm ? String(userProfile.heightCm) : '',
        weightKg: userProfile.weightKg ? String(userProfile.weightKg) : '',
      });
      if (userProfile.calculatedBMI) {
        setBmi(userProfile.calculatedBMI);
      }
    }
  }, [userProfile]);

  useEffect(() => {
    const height = parseFloat(formData.heightCm);
    const weight = parseFloat(formData.weightKg);
    if (height > 0 && weight > 0) {
      const calculatedBMI = calculateBMI(height, weight);
      setBmi(calculatedBMI);
    } else {
      setBmi(0);
    }
  }, [formData.heightCm, formData.weightKg]);

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\d{10}$/.test(formData.phone.trim())) {
      newErrors.phone = 'Phone number must be 10 digits';
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    if (formData.age && (isNaN(Number(formData.age)) || Number(formData.age) < 0 || Number(formData.age) > 150)) {
      newErrors.age = 'Invalid age';
    }

    if (formData.heightCm && (isNaN(Number(formData.heightCm)) || Number(formData.heightCm) <= 0)) {
      newErrors.heightCm = 'Invalid height';
    }

    if (formData.weightKg && (isNaN(Number(formData.weightKg)) || Number(formData.weightKg) <= 0)) {
      newErrors.weightKg = 'Invalid weight';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    try {
      const profile = {
        customerId: userProfile?.customerId || BigInt(Date.now()),
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        address: formData.address,
        preferences: formData.preferences,
        gender: formData.gender,
        age: formData.age ? BigInt(formData.age) : BigInt(0),
        heightCm: formData.heightCm ? parseFloat(formData.heightCm) : 0,
        weightKg: formData.weightKg ? parseFloat(formData.weightKg) : 0,
        calculatedBMI: bmi,
      };

      await saveProfileMutation.mutateAsync(profile);
      toast.success('Profile saved successfully!');
    } catch (error) {
      console.error('Profile save error:', error);
      toast.error('Failed to save profile. Please try again.');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center space-y-4">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-orange-600 border-t-transparent mx-auto"></div>
          <p className="text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Personal Information
          </CardTitle>
          <CardDescription>Update your personal details and contact information</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className={errors.name ? 'border-red-500' : ''}
                />
                {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name}</p>}
              </div>

              <div>
                <Label htmlFor="phone">Mobile Number *</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="10-digit mobile number"
                    className={`pl-10 ${errors.phone ? 'border-red-500' : ''}`}
                  />
                </div>
                {errors.phone && <p className="text-sm text-red-500 mt-1">{errors.phone}</p>}
              </div>

              <div>
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="your@email.com"
                    className={`pl-10 ${errors.email ? 'border-red-500' : ''}`}
                  />
                </div>
                {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email}</p>}
              </div>

              <div>
                <Label htmlFor="preferences">Dietary Preferences</Label>
                <Input
                  id="preferences"
                  value={formData.preferences}
                  onChange={(e) => setFormData({ ...formData, preferences: e.target.value })}
                  placeholder="e.g., Vegan, No nuts"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="address">Delivery Address</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Textarea
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  rows={3}
                  placeholder="Enter your complete delivery address"
                  className="pl-10"
                />
              </div>
            </div>

            <Button type="submit" disabled={saveProfileMutation.isPending} className="w-full md:w-auto">
              {saveProfileMutation.isPending ? 'Saving...' : 'Save Profile'}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5" />
            Health Information
          </CardTitle>
          <CardDescription>Optional health metrics for personalized recommendations</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
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

              <div>
                <Label htmlFor="age">Age (years)</Label>
                <Input
                  id="age"
                  type="number"
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                  placeholder="Enter your age"
                  min="0"
                  max="150"
                  className={errors.age ? 'border-red-500' : ''}
                />
                {errors.age && <p className="text-sm text-red-500 mt-1">{errors.age}</p>}
              </div>

              <div>
                <Label htmlFor="heightCm">Height (cm)</Label>
                <Input
                  id="heightCm"
                  type="number"
                  value={formData.heightCm}
                  onChange={(e) => setFormData({ ...formData, heightCm: e.target.value })}
                  placeholder="Enter height in cm"
                  min="0"
                  step="0.1"
                  className={errors.heightCm ? 'border-red-500' : ''}
                />
                {errors.heightCm && <p className="text-sm text-red-500 mt-1">{errors.heightCm}</p>}
              </div>

              <div>
                <Label htmlFor="weightKg">Weight (kg)</Label>
                <Input
                  id="weightKg"
                  type="number"
                  value={formData.weightKg}
                  onChange={(e) => setFormData({ ...formData, weightKg: e.target.value })}
                  placeholder="Enter weight in kg"
                  min="0"
                  step="0.1"
                  className={errors.weightKg ? 'border-red-500' : ''}
                />
                {errors.weightKg && <p className="text-sm text-red-500 mt-1">{errors.weightKg}</p>}
              </div>
            </div>

            {bmi > 0 && (
              <div className="p-4 bg-muted rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Your BMI</p>
                    <p className="text-2xl font-bold">{bmi.toFixed(1)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Category</p>
                    <p className={`text-lg font-semibold ${getBMICategoryColor(bmi)}`}>
                      {getBMICategory(bmi)}
                    </p>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  BMI is calculated as weight (kg) / height (m)²
                </p>
              </div>
            )}

            <Button type="submit" disabled={saveProfileMutation.isPending} className="w-full md:w-auto">
              {saveProfileMutation.isPending ? 'Saving...' : 'Save Health Info'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
