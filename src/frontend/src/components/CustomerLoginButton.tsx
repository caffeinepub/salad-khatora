import { Button } from '@/components/ui/button';
import { useCustomerAuth } from '../contexts/CustomerAuthContext';
import { useQueryClient } from '@tanstack/react-query';
import { LogIn, LogOut } from 'lucide-react';

export default function CustomerLoginButton() {
  const { login, logout, loginStatus, isAuthenticated } = useCustomerAuth();
  const queryClient = useQueryClient();

  const handleAuth = () => {
    console.log('CustomerLoginButton clicked', { isAuthenticated, loginStatus });
    
    if (isAuthenticated) {
      console.log('Logging out...');
      logout();
      queryClient.clear();
    } else {
      console.log('Attempting login...');
      login();
    }
  };

  const disabled = loginStatus === 'logging-in';
  const text = loginStatus === 'logging-in' ? 'Logging in...' : isAuthenticated ? 'Logout' : 'Login';

  console.log('CustomerLoginButton render', { disabled, text, loginStatus, isAuthenticated });

  return (
    <Button
      onClick={handleAuth}
      disabled={disabled}
      variant={isAuthenticated ? 'outline' : 'default'}
      size="sm"
      className={isAuthenticated ? 'gap-2' : 'gap-2 bg-green-600 hover:bg-green-700 text-white'}
    >
      {isAuthenticated ? <LogOut className="h-4 w-4" /> : <LogIn className="h-4 w-4" />}
      {text}
    </Button>
  );
}
