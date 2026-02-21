import { useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import CustomerForm from '../components/CustomerForm';
import CustomerList from '../components/CustomerList';
import { Loader2 } from 'lucide-react';

export default function CustomersPage() {
  const { identity, isInitializing } = useInternetIdentity();
  const navigate = useNavigate();
  const isAuthenticated = !!identity;

  useEffect(() => {
    if (!isInitializing && !isAuthenticated) {
      navigate({ to: '/admin/login' });
    }
  }, [isAuthenticated, isInitializing, navigate]);

  if (isInitializing) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-fresh-600" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Customer Management</h1>
        <p className="text-muted-foreground mt-2">Add and manage customer information</p>
      </div>

      <CustomerForm />

      <div>
        <h2 className="text-2xl font-semibold text-foreground mb-4">All Customers</h2>
        <CustomerList />
      </div>
    </div>
  );
}
