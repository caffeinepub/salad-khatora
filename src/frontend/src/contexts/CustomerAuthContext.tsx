import { createContext, useContext, ReactNode, useMemo } from 'react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import type { Identity } from '@icp-sdk/core/agent';

interface CustomerAuthContextType {
  identity?: Identity;
  login: () => void;
  logout: () => void;
  loginStatus: string;
  isInitializing: boolean;
  isAuthenticated: boolean;
}

const CustomerAuthContext = createContext<CustomerAuthContextType | undefined>(undefined);

export function CustomerAuthProvider({ children }: { children: ReactNode }) {
  const { identity, login, clear, loginStatus, isInitializing } = useInternetIdentity();
  
  const isAuthenticated = loginStatus === 'success' && !!identity;

  const logout = () => {
    clear();
  };

  const value = useMemo(
    () => ({
      identity,
      login,
      logout,
      loginStatus,
      isInitializing,
      isAuthenticated,
    }),
    [identity, login, logout, loginStatus, isInitializing, isAuthenticated]
  );

  return (
    <CustomerAuthContext.Provider value={value}>
      {children}
    </CustomerAuthContext.Provider>
  );
}

export function useCustomerAuth() {
  const context = useContext(CustomerAuthContext);
  if (!context) {
    throw new Error('useCustomerAuth must be used within CustomerAuthProvider');
  }
  return context;
}
