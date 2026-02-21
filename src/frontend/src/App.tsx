import { StrictMode } from 'react';
import { RouterProvider, createRouter, createRoute, createRootRoute } from '@tanstack/react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Layout from './components/Layout';
import LoginPage from './pages/LoginPage';
import CustomersPage from './pages/CustomersPage';
import OrdersPage from './pages/OrdersPage';
import BillingPage from './pages/BillingPage';
import ProductsPage from './pages/ProductsPage';
import InventoryPage from './pages/InventoryPage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      refetchOnWindowFocus: false,
    },
  },
});

const rootRoute = createRootRoute({
  component: Layout,
});

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/login',
  component: LoginPage,
});

const customersRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/customers',
  component: CustomersPage,
});

const ordersRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/orders',
  component: OrdersPage,
});

const billingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/billing',
  component: BillingPage,
});

const menuRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/menu',
  component: ProductsPage,
});

const inventoryRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/inventory',
  component: InventoryPage,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: () => {
    const navigate = createRouter({ routeTree: rootRoute }).navigate;
    navigate({ to: '/admin/customers' });
    return null;
  },
});

const routeTree = rootRoute.addChildren([
  loginRoute,
  customersRoute,
  ordersRoute,
  billingRoute,
  menuRoute,
  inventoryRoute,
  indexRoute,
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </StrictMode>
  );
}
