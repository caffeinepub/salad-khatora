import { useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Shield, Lock, Fingerprint } from 'lucide-react';

export default function LoginPage() {
  const { login, loginStatus, isInitializing, loginError } = useInternetIdentity();
  const navigate = useNavigate();

  const isAuthenticated = loginStatus === 'success';
  const isLoggingIn = loginStatus === 'logging-in';

  useEffect(() => {
    if (isAuthenticated && !isInitializing) {
      navigate({ to: '/admin/dashboard' });
    }
  }, [isAuthenticated, isInitializing, navigate]);

  const handleLogin = () => {
    try {
      login();
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  if (isInitializing) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-fresh-50 to-orange-50 dark:from-gray-900 dark:to-gray-800">
        <div className="text-center space-y-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-fresh-600 border-t-transparent mx-auto"></div>
          <p className="text-muted-foreground">Initializing...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-fresh-50 to-orange-50 dark:from-gray-900 dark:to-gray-800 p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <img 
              src="/assets/Salad Khatora.jpeg" 
              alt="Salad Khatora" 
              className="h-20 w-20 object-contain rounded-lg"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>
          <CardTitle className="text-2xl font-bold">Admin Panel Login</CardTitle>
          <CardDescription>
            Secure authentication for administrative access
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-start gap-3 p-3 bg-muted rounded-lg">
              <Shield className="h-5 w-5 text-fresh-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm">
                <p className="font-medium">Secure Authentication</p>
                <p className="text-muted-foreground">Login with Internet Identity for maximum security</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-muted rounded-lg">
              <Lock className="h-5 w-5 text-fresh-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm">
                <p className="font-medium">No Passwords</p>
                <p className="text-muted-foreground">Passwordless authentication using cryptographic keys</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-muted rounded-lg">
              <Fingerprint className="h-5 w-5 text-fresh-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm">
                <p className="font-medium">Biometric Support</p>
                <p className="text-muted-foreground">Use fingerprint or face recognition on supported devices</p>
              </div>
            </div>
          </div>

          {loginError && (
            <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
              <p className="text-sm text-destructive">{loginError.message}</p>
            </div>
          )}

          <Button
            onClick={handleLogin}
            disabled={isLoggingIn}
            className="w-full bg-fresh-600 hover:bg-fresh-700 text-white"
            size="lg"
          >
            {isLoggingIn ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent mr-2"></div>
                Connecting...
              </>
            ) : (
              'Login with Internet Identity'
            )}
          </Button>

          <p className="text-xs text-center text-muted-foreground">
            By logging in, you agree to use this admin panel responsibly
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
