import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { useAddCustomer } from '../hooks/useQueries';

interface CustomerFormProps {
  onSuccess?: () => void;
}

export default function CustomerForm({ onSuccess }: CustomerFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    contactDetails: '',
    preferences: '',
  });

  const addCustomer = useAddCustomer();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const customerId = BigInt(Date.now());
      await addCustomer.mutateAsync({
        id: customerId,
        name: formData.name,
        contactDetails: formData.contactDetails,
        preferences: formData.preferences,
      });

      toast.success('Customer added successfully');
      setFormData({ name: '', contactDetails: '', preferences: '' });
      onSuccess?.();
    } catch (error) {
      toast.error('Failed to add customer');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">Customer Name *</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Enter customer name"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="contactDetails">Contact Details *</Label>
          <Input
            id="contactDetails"
            value={formData.contactDetails}
            onChange={(e) => setFormData({ ...formData, contactDetails: e.target.value })}
            placeholder="Phone, email, or address"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="preferences">Preferences</Label>
        <Textarea
          id="preferences"
          value={formData.preferences}
          onChange={(e) => setFormData({ ...formData, preferences: e.target.value })}
          placeholder="Dietary preferences, favorite bowls, etc."
          rows={3}
        />
      </div>

      <Button
        type="submit"
        disabled={addCustomer.isPending}
        className="w-full bg-fresh-600 hover:bg-fresh-700"
      >
        {addCustomer.isPending ? 'Adding...' : 'Add Customer'}
      </Button>
    </form>
  );
}
