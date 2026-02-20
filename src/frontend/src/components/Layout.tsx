import { Link, useNavigate, useLocation } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, Home, Package, ShoppingCart, CreditCard, Calendar, FileText, Users, LogOut, ClipboardList } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { SiCoffeescript } from 'react-icons/si';
import { useQueryClient } from '@tanstack/react-query';

interface LayoutProps {
  children: React.ReactNode;
}

function LoadingScreen() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center space-y-4">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-fresh-600 border-t-transparent mx-auto"></div>
        <p className="text-muted-foreground">Loading...</p>
      </div>
    </div>
  );
}

export default function Layout({ children }: LayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { clear, identity, isInitializing } = useInternetIdentity();
  const queryClient = useQueryClient();
  const hasRedirectedRef = useRef(false);
  const isAuthenticatedRef = useRef(false);

  const isAuthenticated = !!identity;

  // Update ref when authentication state changes
  useEffect(() => {
    isAuthenticatedRef.current = isAuthenticated;
  }, [isAuthenticated]);

  // Redirect to login if not authenticated and not on login page
  useEffect(() => {
    // Skip if still initializing
    if (isInitializing) {
      return;
    }

    // Skip if already on login page
    if (location.pathname === '/admin/login') {
      hasRedirectedRef.current = false;
      return;
    }

    // Only redirect once when not authenticated
    if (!isAuthenticated && !hasRedirectedRef.current) {
      hasRedirectedRef.current = true;
      navigate({ to: '/admin/login' });
    }
  }, [isAuthenticated, isInitializing, location.pathname]);

  const handleLogout = async () => {
    await clear();
    queryClient.clear();
    hasRedirectedRef.current = false;
    navigate({ to: '/admin/login' });
  };

  const allNavItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: Home, requiresAuth: false },
    { name: 'Inventory', path: '/admin/inventory', icon: Package, requiresAuth: false },
    { name: 'Products', path: '/admin/products', icon: ShoppingCart, requiresAuth: false },
    { name: 'Billing', path: '/admin/billing', icon: CreditCard, requiresAuth: false },
    { name: 'Subscriptions', path: '/admin/subscriptions', icon: Calendar, requiresAuth: false },
    { name: 'Orders', path: '/admin/orders', icon: ClipboardList, requiresAuth: false },
    { name: 'Customers', path: '/admin/customers', icon: Users, requiresAuth: true },
    { name: 'Reports', path: '/admin/reports', icon: FileText, requiresAuth: false },
  ];

  const navItems = allNavItems.filter(item => !item.requiresAuth || isAuthenticated);

  // Show loading screen during initialization
  if (isInitializing) {
    return <LoadingScreen />;
  }

  // Don't wrap login page
  if (location.pathname === '/admin/login') {
    return <>{children}</>;
  }

  // Show loading if not authenticated (will redirect)
  if (!isAuthenticated) {
    return <LoadingScreen />;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-64">
                <nav className="flex flex-col gap-2 mt-8">
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.path;
                    return (
                      <Link
                        key={item.path}
                        to={item.path}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
                          isActive
                            ? 'bg-fresh-100 dark:bg-fresh-900/20 text-fresh-700 dark:text-fresh-400'
                            : 'hover:bg-muted'
                        }`}
                      >
                        <Icon className="h-5 w-5" />
                        <span>{item.name}</span>
                      </Link>
                    );
                  })}
                </nav>
              </SheetContent>
            </Sheet>

            <Link to="/admin/dashboard" className="flex items-center gap-2">
              <img 
                src="/assets/Salad Khatora.jpeg" 
                alt="Salad Khatora" 
                className="h-10 w-10 object-contain rounded"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
              <span className="font-bold text-xl hidden sm:inline-block">Salad Khatora Admin Panel</span>
            </Link>
          </div>

          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-2 px-3 py-2 rounded-md transition-colors text-sm ${
                    isActive
                      ? 'bg-fresh-100 dark:bg-fresh-900/20 text-fresh-700 dark:text-fresh-400'
                      : 'hover:bg-muted'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>

          <Button variant="ghost" size="sm" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6 md:py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t mt-12">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
            <p>© {new Date().getFullYear()} Salad Khatora. All rights reserved.</p>
            <p className="flex items-center gap-1">
              Built with <SiCoffeescript className="h-4 w-4 text-fresh-600" /> using{' '}
              <a
                href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(
                  typeof window !== 'undefined' ? window.location.hostname : 'salad-khatora'
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-fresh-600 hover:underline"
              >
                caffeine.ai
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
