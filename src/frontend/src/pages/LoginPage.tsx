import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';

export default function LoginPage() {
  const { login, isLoggingIn, identity } = useInternetIdentity();
  const navigate = useNavigate();

  useEffect(() => {
    if (identity) {
      navigate({ to: '/dashboard' });
    }
  }, [identity, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-sm space-y-6 text-center">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold">Salad Khatora</h1>
          <p className="text-muted-foreground">
            Sign in to access your account
          </p>
        </div>
        
        <Button
          onClick={login}
          disabled={isLoggingIn}
          className="w-full"
          size="lg"
        >
          {isLoggingIn ? 'Connecting...' : 'Login with Internet Identity'}
        </Button>
      </div>
    </div>
  );
}
