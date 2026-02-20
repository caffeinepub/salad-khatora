import { ReactNode, useRef, useEffect } from 'react';
import { useCustomerAuth } from '../contexts/CustomerAuthContext';
import { Navigate } from '@tanstack/react-router';

function LoadingScreen() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center space-y-4">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-orange-600 border-t-transparent mx-auto"></div>
        <p className="text-muted-foreground">Loading...</p>
      </div>
    </div>
  );
}

export default function CustomerProtectedRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated, isInitializing } = useCustomerAuth();
  const hasRedirectedRef = useRef(false);

  useEffect(() => {
    if (!isInitializing && !isAuthenticated && !hasRedirectedRef.current) {
      hasRedirectedRef.current = true;
    }
  }, [isInitializing, isAuthenticated]);

  if (isInitializing) {
    return <LoadingScreen />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/user/login" />;
  }

  return <>{children}</>;
}
