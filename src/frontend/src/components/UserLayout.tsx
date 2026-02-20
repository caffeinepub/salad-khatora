import { Link, useLocation } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, ShoppingCart, MapPin, LayoutDashboard } from 'lucide-react';
import { useState } from 'react';
import { useCart } from '../contexts/CartContext';
import { useCustomerAuth } from '../contexts/CustomerAuthContext';
import CartDrawer from './CartDrawer';
import CustomerLoginButton from './CustomerLoginButton';
import { SiCoffeescript } from 'react-icons/si';

interface UserLayoutProps {
  children: React.ReactNode;
}

export default function UserLayout({ children }: UserLayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const location = useLocation();
  const { items } = useCart();
  const { isAuthenticated } = useCustomerAuth();

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  const navItems = [
    { name: 'Menu', path: '/user/menu' },
    { name: 'Track Order', path: '/user/track-order' },
  ];

  if (isAuthenticated) {
    navItems.push({ name: 'Dashboard', path: '/user/dashboard' });
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-white/95 dark:bg-gray-900/95 backdrop-blur supports-[backdrop-filter]:bg-white/80 dark:supports-[backdrop-filter]:bg-gray-900/80 shadow-sm">
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
                    const isActive = location.pathname === item.path;
                    return (
                      <Link
                        key={item.path}
                        to={item.path}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`px-3 py-2 rounded-md transition-colors flex items-center gap-2 ${
                          isActive
                            ? 'bg-orange-100 dark:bg-orange-900/20 text-orange-700 dark:text-orange-400'
                            : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                        }`}
                      >
                        {item.name === 'Dashboard' && <LayoutDashboard className="h-4 w-4" />}
                        {item.name}
                      </Link>
                    );
                  })}
                </nav>
              </SheetContent>
            </Sheet>

            <Link to="/user/menu" className="flex items-center gap-2">
              <img 
                src="/assets/Salad Khatora.jpeg" 
                alt="Salad Khatora" 
                className="h-10 w-10 object-contain rounded"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
              <span className="font-bold text-xl text-orange-600 dark:text-orange-400">Salad Khatora</span>
            </Link>
          </div>

          <nav className="hidden md:flex items-center gap-6">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`text-sm font-medium transition-colors flex items-center gap-2 ${
                    isActive
                      ? 'text-orange-600 dark:text-orange-400'
                      : 'text-gray-600 dark:text-gray-300 hover:text-orange-600 dark:hover:text-orange-400'
                  }`}
                >
                  {item.name === 'Dashboard' && <LayoutDashboard className="h-4 w-4" />}
                  {item.name}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            <CustomerLoginButton />
            <Button
              variant="ghost"
              size="icon"
              className="relative"
              onClick={() => setCartOpen(true)}
            >
              <ShoppingCart className="h-5 w-5" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-orange-600 text-white text-xs flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6 md:py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t bg-white dark:bg-gray-900 mt-12">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-bold text-lg mb-3 text-orange-600 dark:text-orange-400">Salad Khatora</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Fresh, healthy salad bowls delivered to your doorstep.
              </p>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-3">Contact</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Delivering across the city
              </p>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-3">Hours</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Mon - Sat: 9:00 AM - 9:00 PM<br />
                Sunday: 10:00 AM - 8:00 PM
              </p>
            </div>
          </div>
          <div className="border-t mt-6 pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-600 dark:text-gray-400">
            <p>© {new Date().getFullYear()} Salad Khatora. All rights reserved.</p>
            <p className="flex items-center gap-1">
              Built with <SiCoffeescript className="h-4 w-4 text-orange-600" /> using{' '}
              <a
                href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(
                  typeof window !== 'undefined' ? window.location.hostname : 'salad-khatora'
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-orange-600 hover:underline"
              >
                caffeine.ai
              </a>
            </p>
          </div>
        </div>
      </footer>

      <CartDrawer open={cartOpen} onOpenChange={setCartOpen} />
    </div>
  );
}
