import { createRouter, createRoute, createRootRoute, RouterProvider, Outlet, Navigate } from '@tanstack/react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/sonner';
import { InternetIdentityProvider, useInternetIdentity } from './hooks/useInternetIdentity';
import { CustomerAuthProvider } from './contexts/CustomerAuthContext';
import Layout from './components/Layout';
import UserLayout from './components/UserLayout';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import InventoryPage from './pages/InventoryPage';
import ProductsPage from './pages/ProductsPage';
import BillingPage from './pages/BillingPage';
import SubscriptionsPage from './pages/SubscriptionsPage';
import ReportsPage from './pages/ReportsPage';
import CustomersPage from './pages/CustomersPage';
import OrdersPage from './pages/OrdersPage';
import UserMenuPage from './pages/UserMenuPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderConfirmationPage from './pages/OrderConfirmationPage';
import OrderTrackingPage from './pages/OrderTrackingPage';
import CustomerLoginPage from './pages/CustomerLoginPage';
import UserDashboardPage from './pages/UserDashboardPage';
import CustomerProtectedRoute from './components/CustomerProtectedRoute';
import { CartProvider } from './contexts/CartContext';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      refetchOnWindowFocus: false,
    },
  },
});

// Loading component
function LoadingScreen() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center space-y-4">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-fresh-600 border-t-transparent mx-auto"></div>
        <p className="text-muted-foreground">Loading...</p>
      </div>
    </div>
  );
}

// Protected route wrapper component for admin routes
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { loginStatus, isInitializing } = useInternetIdentity();
  const isAuthenticated = loginStatus === 'success';

  if (isInitializing) {
    return <LoadingScreen />;
  }

  if (!isAuthenticated) {
    window.location.href = '/admin/login';
    return null;
  }

  return <>{children}</>;
}

// Root route
const rootRoute = createRootRoute({
  component: () => <Outlet />,
});

// Redirect root to user menu
const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: () => <Navigate to="/user/menu" />,
});

// Admin root route with Layout
const adminRootRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin',
  component: () => (
    <Layout>
      <Outlet />
    </Layout>
  ),
});

// Admin login route
const adminLoginRoute = createRoute({
  getParentRoute: () => adminRootRoute,
  path: '/login',
  component: LoginPage,
});

// Admin dashboard route
const adminDashboardRoute = createRoute({
  getParentRoute: () => adminRootRoute,
  path: '/dashboard',
  component: () => (
    <ProtectedRoute>
      <DashboardPage />
    </ProtectedRoute>
  ),
});

// Admin inventory route
const adminInventoryRoute = createRoute({
  getParentRoute: () => adminRootRoute,
  path: '/inventory',
  component: () => (
    <ProtectedRoute>
      <InventoryPage />
    </ProtectedRoute>
  ),
});

// Admin products route
const adminProductsRoute = createRoute({
  getParentRoute: () => adminRootRoute,
  path: '/products',
  component: () => (
    <ProtectedRoute>
      <ProductsPage />
    </ProtectedRoute>
  ),
});

// Admin billing route
const adminBillingRoute = createRoute({
  getParentRoute: () => adminRootRoute,
  path: '/billing',
  component: () => (
    <ProtectedRoute>
      <BillingPage />
    </ProtectedRoute>
  ),
});

// Admin subscriptions route
const adminSubscriptionsRoute = createRoute({
  getParentRoute: () => adminRootRoute,
  path: '/subscriptions',
  component: () => (
    <ProtectedRoute>
      <SubscriptionsPage />
    </ProtectedRoute>
  ),
});

// Admin reports route
const adminReportsRoute = createRoute({
  getParentRoute: () => adminRootRoute,
  path: '/reports',
  component: () => (
    <ProtectedRoute>
      <ReportsPage />
    </ProtectedRoute>
  ),
});

// Admin customers route
const adminCustomersRoute = createRoute({
  getParentRoute: () => adminRootRoute,
  path: '/customers',
  component: () => (
    <ProtectedRoute>
      <CustomersPage />
    </ProtectedRoute>
  ),
});

// Admin orders route
const adminOrdersRoute = createRoute({
  getParentRoute: () => adminRootRoute,
  path: '/orders',
  component: () => (
    <ProtectedRoute>
      <OrdersPage />
    </ProtectedRoute>
  ),
});

// User root route with CustomerAuthProvider, CartProvider, and UserLayout
const userRootRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/user',
  component: () => (
    <CustomerAuthProvider>
      <CartProvider>
        <UserLayout>
          <Outlet />
        </UserLayout>
      </CartProvider>
    </CustomerAuthProvider>
  ),
});

// User login route
const userLoginRoute = createRoute({
  getParentRoute: () => userRootRoute,
  path: '/login',
  component: CustomerLoginPage,
});

// User menu route
const userMenuRoute = createRoute({
  getParentRoute: () => userRootRoute,
  path: '/menu',
  component: UserMenuPage,
});

// User dashboard route (protected)
const userDashboardRoute = createRoute({
  getParentRoute: () => userRootRoute,
  path: '/dashboard',
  component: () => (
    <CustomerProtectedRoute>
      <UserDashboardPage />
    </CustomerProtectedRoute>
  ),
});

// User checkout route
const userCheckoutRoute = createRoute({
  getParentRoute: () => userRootRoute,
  path: '/checkout',
  component: CheckoutPage,
});

// User order confirmation route
const userOrderConfirmationRoute = createRoute({
  getParentRoute: () => userRootRoute,
  path: '/order-confirmation/$orderId',
  component: OrderConfirmationPage,
});

// User order tracking route
const userOrderTrackingRoute = createRoute({
  getParentRoute: () => userRootRoute,
  path: '/track-order',
  component: OrderTrackingPage,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  adminRootRoute.addChildren([
    adminLoginRoute,
    adminDashboardRoute,
    adminInventoryRoute,
    adminProductsRoute,
    adminBillingRoute,
    adminSubscriptionsRoute,
    adminReportsRoute,
    adminCustomersRoute,
    adminOrdersRoute,
  ]),
  userRootRoute.addChildren([
    userLoginRoute,
    userMenuRoute,
    userDashboardRoute,
    userCheckoutRoute,
    userOrderConfirmationRoute,
    userOrderTrackingRoute,
  ]),
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <InternetIdentityProvider>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
        <Toaster />
      </QueryClientProvider>
    </InternetIdentityProvider>
  );
}
