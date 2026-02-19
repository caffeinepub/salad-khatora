import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Salad } from 'lucide-react';

export default function LoginPage() {
  const { login, isLoggingIn, identity } = useInternetIdentity();
  const navigate = useNavigate();

  useEffect(() => {
    if (identity) {
      navigate({ to: '/dashboard' });
    }
  }, [identity, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-fresh-50 to-fresh-100 dark:from-background dark:to-accent p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-20 h-20 bg-fresh-500 rounded-full flex items-center justify-center">
            <Salad className="w-12 h-12 text-white" />
          </div>
          <CardTitle className="text-3xl font-bold text-fresh-800 dark:text-fresh-400">
            Salad Khatora
          </CardTitle>
          <CardDescription className="text-base">
            Business Management System
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center text-sm text-muted-foreground">
            <p>Manage your salad business with ease.</p>
            <p className="mt-2">Track inventory, sales, and subscriptions all in one place.</p>
          </div>
          <Button
            onClick={login}
            disabled={isLoggingIn}
            className="w-full h-12 text-base bg-fresh-600 hover:bg-fresh-700 text-white"
            size="lg"
          >
            {isLoggingIn ? (
              <>
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                Connecting...
              </>
            ) : (
              'Login to Continue'
            )}
          </Button>
          <p className="text-xs text-center text-muted-foreground">
            Secure authentication powered by Internet Identity
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
