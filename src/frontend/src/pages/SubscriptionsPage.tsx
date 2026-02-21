import { useNavigate } from '@tanstack/react-router';
import { useEffect } from 'react';

export default function SubscriptionsPage() {
  const navigate = useNavigate();

  useEffect(() => {
    navigate({ to: '/admin/customers' });
  }, [navigate]);

  return null;
}
