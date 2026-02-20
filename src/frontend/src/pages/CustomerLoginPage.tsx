import { useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useCustomerAuth } from '../contexts/CustomerAuthContext';
import { Shield, Zap, Lock } from 'lucide-react';

export default function CustomerLoginPage() {
  const navigate = useNavigate();
  const { login, isAuthenticated, loginStatus } = useCustomerAuth();

  useEffect(() => {
    if (isAuthenticated) {
      navigate({ to: '/user/dashboard' });
    }
  }, [isAuthenticated, navigate]);

  const handleLogin = () => {
    login();
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-orange-100 dark:bg-orange-900/20 flex items-center justify-center">
            <Shield className="h-6 w-6 text-orange-600" />
          </div>
          <CardTitle className="text-2xl">Welcome to Salad Khatora</CardTitle>
          <CardDescription>
            Sign in to access your dashboard, manage your profile, and track your orders
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <Zap className="h-5 w-5 text-orange-600 mt-0.5" />
              <div>
                <h4 className="font-medium">Fast & Secure</h4>
                <p className="text-sm text-muted-foreground">
                  Login securely using Internet Identity - no passwords needed
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Lock className="h-5 w-5 text-orange-600 mt-0.5" />
              <div>
                <h4 className="font-medium">Privacy First</h4>
                <p className="text-sm text-muted-foreground">
                  Your data is encrypted and stored securely on the blockchain
                </p>
              </div>
            </div>
          </div>

          <Button
            onClick={handleLogin}
            disabled={loginStatus === 'logging-in'}
            className="w-full"
            size="lg"
          >
            {loginStatus === 'logging-in' ? 'Connecting...' : 'Login with Internet Identity'}
          </Button>

          <p className="text-xs text-center text-muted-foreground">
            By logging in, you agree to our Terms of Service and Privacy Policy
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
