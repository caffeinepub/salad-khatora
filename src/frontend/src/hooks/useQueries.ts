import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { Customer, Recipe, Subscription, SaladBowlType, Time, SaladBowl, Ingredient, StockTransactionType, StockStatus, Order, UserProfile } from '../backend';
import { toast } from 'sonner';

// Analytics Metrics
export function useAnalyticsMetrics() {
  const { actor, isFetching } = useActor();

  return useQuery({
    queryKey: ['analyticsMetrics'],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getAnalyticsMetrics();
    },
    enabled: !!actor && !isFetching,
    staleTime: 30000, // 30 seconds
  });
}

// Plan Durations
export function useWeeklyPlanDuration() {
  const { actor, isFetching } = useActor();

  return useQuery({
    queryKey: ['weeklyPlanDuration'],
    queryFn: async () => {
      if (!actor) return 7;
      return Number(await actor.weeklyPlanDuration());
    },
    enabled: !!actor && !isFetching,
    staleTime: Infinity,
  });
}

export function useMonthlyPlanDuration() {
  const { actor, isFetching } = useActor();

  return useQuery({
    queryKey: ['monthlyPlanDuration'],
    queryFn: async () => {
      if (!actor) return 30;
      return Number(await actor.monthlyPlanDuration());
    },
    enabled: !!actor && !isFetching,
    staleTime: Infinity,
  });
}

// Bowl Sizes
export function useBowlSizes() {
  const { actor, isFetching } = useActor();

  return useQuery({
    queryKey: ['bowlSizes'],
    queryFn: async () => {
      if (!actor) return { gm250: true, gm350: true, gm500: true };
      return actor.bowlSizes();
    },
    enabled: !!actor && !isFetching,
    staleTime: Infinity,
  });
}

// Product Management
export function useAllProducts() {
  const { actor, isFetching } = useActor();

  return useQuery<SaladBowl[]>({
    queryKey: ['products'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllProductsWithInactive();
    },
    enabled: !!actor && !isFetching,
    staleTime: 60000, // 1 minute
  });
}

export function useActiveProducts() {
  const { actor, isFetching } = useActor();

  return useQuery<SaladBowl[]>({
    queryKey: ['activeProducts'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllActiveProducts();
    },
    enabled: !!actor && !isFetching,
    staleTime: 60000, // 1 minute
  });
}

export function useAddProduct() {
  const queryClient = useQueryClient();
  const { actor } = useActor();

  return useMutation({
    mutationFn: async (product: SaladBowl) => {
      if (!actor) throw new Error('Actor not initialized');
      const productId = await actor.addProduct(product);
      return productId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['activeProducts'] });
      toast.success('Product added successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to add product');
    },
  });
}

export function useToggleProductAvailability() {
  const queryClient = useQueryClient();
  const { actor } = useActor();

  return useMutation({
    mutationFn: async ({ bowlName, isAvailable }: { bowlName: string; isAvailable: boolean }) => {
      if (!actor) throw new Error('Actor not initialized');
      await actor.toggleSaladBowlAvailability(bowlName, isAvailable);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['activeProducts'] });
    },
  });
}

export function useUpdateProduct() {
  const queryClient = useQueryClient();
  const { actor } = useActor();

  return useMutation({
    mutationFn: async ({ name, updatedProduct }: { name: string; updatedProduct: SaladBowl }) => {
      if (!actor) throw new Error('Actor not initialized');
      
      const products = await actor.getAllProductsWithInactive();
      const productIndex = products.findIndex(p => p.name === name);
      
      if (productIndex === -1) {
        throw new Error('Product not found');
      }
      
      const result = await actor.updateProduct(BigInt(productIndex), updatedProduct);
      if (!result) throw new Error('Failed to update product');
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['activeProducts'] });
    },
  });
}

export function useDeleteProduct() {
  const queryClient = useQueryClient();
  const { actor } = useActor();

  return useMutation({
    mutationFn: async (name: string) => {
      if (!actor) throw new Error('Actor not initialized');
      
      const products = await actor.getAllProductsWithInactive();
      const productIndex = products.findIndex(p => p.name === name);
      
      if (productIndex === -1) {
        throw new Error('Product not found');
      }
      
      const result = await actor.deleteProduct(BigInt(productIndex));
      if (!result) throw new Error('Failed to delete product');
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['activeProducts'] });
    },
  });
}

// Edit Recipe
export function useEditRecipe() {
  const queryClient = useQueryClient();
  const { actor } = useActor();

  return useMutation({
    mutationFn: async ({ bowlName, newRecipe }: { bowlName: string; newRecipe: Recipe }) => {
      if (!actor) throw new Error('Actor not initialized');
      const result = await actor.editSaladBowlRecipe(bowlName, newRecipe);
      if (!result) throw new Error('Failed to update recipe');
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['activeProducts'] });
    },
  });
}

// Ingredient Management
export function useAllIngredients() {
  const { actor, isFetching } = useActor();

  return useQuery<Ingredient[]>({
    queryKey: ['ingredients'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllIngredients();
    },
    enabled: !!actor && !isFetching,
    staleTime: 60000, // 1 minute
  });
}

export function useAddIngredient() {
  const queryClient = useQueryClient();
  const { actor } = useActor();

  return useMutation({
    mutationFn: async (ingredient: Ingredient) => {
      if (!actor) throw new Error('Actor not initialized');
      await actor.addIngredient(ingredient);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ingredients'] });
      queryClient.invalidateQueries({ queryKey: ['stockStatus'] });
      toast.success('Ingredient added successfully');
    },
  });
}

export function useUpdateIngredient() {
  const queryClient = useQueryClient();
  const { actor } = useActor();

  return useMutation({
    mutationFn: async ({ name, updatedIngredient }: { name: string; updatedIngredient: Ingredient }) => {
      if (!actor) throw new Error('Actor not initialized');
      const result = await actor.updateIngredient(name, updatedIngredient);
      if (!result) throw new Error('Failed to update ingredient');
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ingredients'] });
      queryClient.invalidateQueries({ queryKey: ['stockStatus'] });
      toast.success('Ingredient updated successfully');
    },
  });
}

export function useDeleteIngredient() {
  const queryClient = useQueryClient();
  const { actor } = useActor();

  return useMutation({
    mutationFn: async (name: string) => {
      if (!actor) throw new Error('Actor not initialized');
      const result = await actor.deleteIngredient(name);
      if (!result) throw new Error('Failed to delete ingredient');
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ingredients'] });
      queryClient.invalidateQueries({ queryKey: ['stockStatus'] });
      toast.success('Ingredient deleted successfully');
    },
  });
}

// Stock Management
export function useStockStatus() {
  const { actor, isFetching } = useActor();

  return useQuery<StockStatus[]>({
    queryKey: ['stockStatus'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getStockStatus();
    },
    enabled: !!actor && !isFetching,
    staleTime: 30000, // 30 seconds
  });
}

export function useRecordStockIn() {
  const queryClient = useQueryClient();
  const { actor } = useActor();

  return useMutation({
    mutationFn: async ({
      ingredientName,
      quantity,
      supplier,
      costPrice,
      unitType,
    }: {
      ingredientName: string;
      quantity: bigint;
      supplier: string;
      costPrice: bigint;
      unitType: string;
    }) => {
      if (!actor) throw new Error('Actor not initialized');
      const result = await actor.recordStockIn(ingredientName, quantity, supplier, costPrice, unitType);
      if (!result) throw new Error('Failed to record stock in');
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stockStatus'] });
      queryClient.invalidateQueries({ queryKey: ['stockTransactions'] });
      queryClient.invalidateQueries({ queryKey: ['ingredients'] });
      toast.success('Stock in recorded successfully');
    },
  });
}

export function useRecordStockOut() {
  const queryClient = useQueryClient();
  const { actor } = useActor();

  return useMutation({
    mutationFn: async ({
      ingredientName,
      quantity,
      reason,
    }: {
      ingredientName: string;
      quantity: bigint;
      reason: string;
    }) => {
      if (!actor) throw new Error('Actor not initialized');
      const result = await actor.recordStockOut(ingredientName, quantity, reason);
      if (!result) throw new Error('Failed to record stock out');
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stockStatus'] });
      queryClient.invalidateQueries({ queryKey: ['stockTransactions'] });
      queryClient.invalidateQueries({ queryKey: ['ingredients'] });
      toast.success('Stock out recorded successfully');
    },
  });
}

export function useRecordWriteOff() {
  const queryClient = useQueryClient();
  const { actor } = useActor();

  return useMutation({
    mutationFn: async ({
      ingredientName,
      quantity,
      reason,
    }: {
      ingredientName: string;
      quantity: bigint;
      reason: string;
    }) => {
      if (!actor) throw new Error('Actor not initialized');
      const result = await actor.recordWriteOff(ingredientName, quantity, reason);
      if (!result) throw new Error('Failed to record write-off');
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stockStatus'] });
      queryClient.invalidateQueries({ queryKey: ['stockTransactions'] });
      queryClient.invalidateQueries({ queryKey: ['ingredients'] });
      toast.success('Write-off recorded successfully');
    },
  });
}

export function useGetStockTransactionsByType(transactionType: StockTransactionType) {
  const { actor, isFetching } = useActor();

  return useQuery({
    queryKey: ['stockTransactions', transactionType],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getStockTransactionsByType(transactionType);
    },
    enabled: !!actor && !isFetching,
    staleTime: 30000, // 30 seconds
  });
}

// Customer Management
export function useAllCustomers() {
  const { actor, isFetching } = useActor();

  return useQuery<Customer[]>({
    queryKey: ['customers'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllCustomers();
    },
    enabled: !!actor && !isFetching,
    staleTime: 60000, // 1 minute
  });
}

export function useAddCustomer() {
  const queryClient = useQueryClient();
  const { actor } = useActor();

  return useMutation({
    mutationFn: async (customer: {
      name: string;
      phone: string;
      email: string;
      address: string;
      preferences: string;
      gender: string;
      age: bigint;
      heightCm: number;
      weightKg: number;
      calculatedBMI: number;
    }) => {
      if (!actor) throw new Error('Actor not initialized');
      
      const customerId = await actor.addCustomer(
        customer.name,
        customer.phone,
        customer.email,
        customer.address,
        customer.preferences,
        customer.gender,
        customer.age,
        customer.heightCm,
        customer.weightKg,
        customer.calculatedBMI
      );
      
      return customerId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      toast.success('Customer added successfully');
    },
    onError: (error: any) => {
      console.error('Add customer error:', error);
      toast.error(error.message || 'Failed to add customer');
    },
  });
}

// Subscription Management
export function useAllSubscriptions() {
  const { actor, isFetching } = useActor();

  return useQuery<Subscription[]>({
    queryKey: ['subscriptions'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllSubscriptions();
    },
    enabled: !!actor && !isFetching,
    staleTime: 60000, // 1 minute
  });
}

export function useCreateSubscription() {
  const queryClient = useQueryClient();
  const { actor } = useActor();

  return useMutation({
    mutationFn: async (subscription: {
      id: bigint;
      name: string;
      customerName: string;
      phoneNumber: string;
      planType: string;
      bowlSize: SaladBowlType;
      price: bigint;
      isPaid: boolean;
      startDate: Time;
      endDate: Time;
      remainingDeliveries: bigint;
    }) => {
      if (!actor) throw new Error('Actor not initialized');
      const result = await actor.createSubscription(
        subscription.id,
        subscription.name,
        subscription.customerName,
        subscription.phoneNumber,
        subscription.planType,
        subscription.bowlSize,
        subscription.price,
        subscription.isPaid,
        subscription.startDate,
        subscription.endDate,
        subscription.remainingDeliveries
      );
      if (!result) throw new Error('Failed to create subscription');
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscriptions'] });
      toast.success('Subscription created successfully');
    },
  });
}

export function useEditSubscription() {
  const queryClient = useQueryClient();
  const { actor } = useActor();

  return useMutation({
    mutationFn: async (subscription: {
      id: bigint;
      name: string;
      customerName: string;
      phoneNumber: string;
      planType: string;
      bowlSize: SaladBowlType;
      price: bigint;
      isPaid: boolean;
      startDate: Time;
      endDate: Time;
      remainingDeliveries: bigint;
    }) => {
      if (!actor) throw new Error('Actor not initialized');
      const result = await actor.editSubscription(
        subscription.id,
        subscription.name,
        subscription.customerName,
        subscription.phoneNumber,
        subscription.planType,
        subscription.bowlSize,
        subscription.price,
        subscription.isPaid,
        subscription.startDate,
        subscription.endDate,
        subscription.remainingDeliveries
      );
      if (!result) throw new Error('Failed to edit subscription');
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscriptions'] });
      toast.success('Subscription updated successfully');
    },
  });
}

export function useDeleteSubscription() {
  const queryClient = useQueryClient();
  const { actor } = useActor();

  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error('Actor not initialized');
      const result = await actor.deleteSubscription(id);
      if (!result) throw new Error('Failed to delete subscription');
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscriptions'] });
      toast.success('Subscription deleted successfully');
    },
  });
}

// Order Management
export function useOrders() {
  const { actor, isFetching } = useActor();

  return useQuery<Order[]>({
    queryKey: ['orders'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllOrders();
    },
    enabled: !!actor && !isFetching,
    staleTime: 30000, // 30 seconds
  });
}

export function useAddOrder() {
  const queryClient = useQueryClient();
  const { actor } = useActor();

  return useMutation({
    mutationFn: async (order: {
      customerId: bigint;
      customerName: string;
      phone: string;
      deliveryAddress: string;
      items: Array<[string, bigint]>;
      orderTotal: bigint;
      paymentMode: string;
      orderStatus: string;
    }) => {
      if (!actor) throw new Error('Actor not initialized');
      const orderId = await actor.addOrder(
        order.customerId,
        order.customerName,
        order.phone,
        order.deliveryAddress,
        order.items,
        order.orderTotal,
        order.paymentMode,
        order.orderStatus
      );
      return orderId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      toast.success('Order created successfully');
    },
  });
}

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();
  const { actor } = useActor();

  return useMutation({
    mutationFn: async ({ orderId, newStatus }: { orderId: bigint; newStatus: string }) => {
      if (!actor) throw new Error('Actor not initialized');
      const result = await actor.updateOrderStatus(orderId, newStatus);
      if (!result) throw new Error('Failed to update order status');
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      toast.success('Order status updated');
    },
  });
}

// User Profile Management
export function useGetCallerUserProfile() {
  const { actor, isFetching } = useActor();

  const query = useQuery<UserProfile | null>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !isFetching,
    retry: false,
  });

  return {
    ...query,
    isLoading: isFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useSaveCallerUserProfile() {
  const queryClient = useQueryClient();
  const { actor } = useActor();

  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error('Actor not initialized');
      await actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      toast.success('Profile saved successfully');
    },
  });
}

export function useGetCustomerOrders(customerId: bigint) {
  const { actor, isFetching } = useActor();

  return useQuery<Order[]>({
    queryKey: ['customerOrders', customerId.toString()],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getCustomerOrders(customerId);
    },
    enabled: !!actor && !isFetching && customerId > BigInt(0),
    staleTime: 30000,
  });
}
