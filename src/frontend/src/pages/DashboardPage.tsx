import { useNavigate } from '@tanstack/react-router';
import { useEffect } from 'react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';

export default function DashboardPage() {
  const navigate = useNavigate();
  const { identity } = useInternetIdentity();

  useEffect(() => {
    if (!identity) {
      navigate({ to: '/admin/login' });
    } else {
      navigate({ to: '/admin/customers' });
    }
  }, [identity, navigate]);

  return null;
}
