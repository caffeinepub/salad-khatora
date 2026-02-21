import { Outlet, useNavigate, useLocation } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { Toaster } from '@/components/ui/sonner';
import {
  Users,
  ShoppingCart,
  CreditCard,
  Menu,
  Package,
} from 'lucide-react';

export default function Layout() {
  const { identity, clear, login, loginStatus } = useInternetIdentity();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const location = useLocation();
  const isAuthenticated = !!identity;

  useEffect(() => {
    if (!isAuthenticated && !location.pathname.includes('/admin/login')) {
      navigate({ to: '/admin/login' });
    }
  }, [isAuthenticated, location.pathname, navigate]);

  const handleAuth = async () => {
    if (isAuthenticated) {
      await clear();
      queryClient.clear();
      navigate({ to: '/admin/login' });
    } else {
      try {
        await login();
      } catch (error: any) {
        console.error('Login error:', error);
        if (error.message === 'User is already authenticated') {
          await clear();
          setTimeout(() => login(), 300);
        }
      }
    }
  };

  const navItems = [
    { path: '/admin/customers', label: 'Customers', icon: Users },
    { path: '/admin/orders', label: 'Orders', icon: ShoppingCart },
    { path: '/admin/billing', label: 'Billing', icon: CreditCard },
    { path: '/admin/menu', label: 'Menu', icon: Menu },
    { path: '/admin/inventory', label: 'Inventory', icon: Package },
  ];

  if (location.pathname.includes('/admin/login')) {
    return (
      <>
        <Outlet />
        <Toaster />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className="w-64 bg-card border-r border-border flex flex-col">
        <div className="p-6 border-b border-border">
          <h1 className="text-2xl font-bold text-fresh-600">Salad Khatora</h1>
          <p className="text-sm text-muted-foreground">Admin Panel</p>
        </div>

        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <li key={item.path}>
                  <button
                    onClick={() => navigate({ to: item.path })}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-fresh-100 text-fresh-700 font-medium'
                        : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="p-4 border-t border-border">
          <button
            onClick={handleAuth}
            disabled={loginStatus === 'logging-in'}
            className="w-full px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium transition-colors disabled:opacity-50"
          >
            {loginStatus === 'logging-in' ? 'Logging out...' : 'Logout'}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <main className="flex-1 p-8">
          <Outlet />
        </main>

        <footer className="border-t border-border bg-card py-6">
          <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
            <p>
              © {new Date().getFullYear()} Salad Khatora. Built with love using{' '}
              <a
                href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(
                  window.location.hostname
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-fresh-600 hover:underline"
              >
                caffeine.ai
              </a>
            </p>
          </div>
        </footer>
      </div>

      <Toaster />
    </div>
  );
}
