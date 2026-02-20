import { Button } from '@/components/ui/button';
import { useCustomerAuth } from '../contexts/CustomerAuthContext';
import { useQueryClient } from '@tanstack/react-query';
import { LogIn, LogOut } from 'lucide-react';

export default function CustomerLoginButton() {
  const { login, logout, loginStatus, isAuthenticated } = useCustomerAuth();
  const queryClient = useQueryClient();

  const handleAuth = async () => {
    if (isAuthenticated) {
      await logout();
      queryClient.clear();
    } else {
      try {
        await login();
      } catch (error: any) {
        console.error('Login error:', error);
        if (error.message === 'User is already authenticated') {
          await logout();
          setTimeout(() => login(), 300);
        }
      }
    }
  };

  const disabled = loginStatus === 'logging-in';
  const text = loginStatus === 'logging-in' ? 'Logging in...' : isAuthenticated ? 'Logout' : 'Login';

  return (
    <Button
      onClick={handleAuth}
      disabled={disabled}
      variant={isAuthenticated ? 'outline' : 'default'}
      size="sm"
      className="gap-2"
    >
      {isAuthenticated ? <LogOut className="h-4 w-4" /> : <LogIn className="h-4 w-4" />}
      {text}
    </Button>
  );
}
