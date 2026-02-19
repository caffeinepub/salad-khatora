import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { Customer, Recipe, Subscription, SaladBowlType, Time, SaladBowl, Ingredient, StockTransactionType, StockStatus } from '../backend';
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
    },
  });
}

export function useUpdateProduct() {
  const queryClient = useQueryClient();
  const { actor } = useActor();

  return useMutation({
    mutationFn: async ({ name, updatedProduct }: { name: string; updatedProduct: SaladBowl }) => {
      if (!actor) throw new Error('Actor not initialized');
      
      // Find the product by name to get its ID
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
    },
  });
}

export function useDeleteProduct() {
  const queryClient = useQueryClient();
  const { actor } = useActor();

  return useMutation({
    mutationFn: async (name: string) => {
      if (!actor) throw new Error('Actor not initialized');
      
      // Find the product by name to get its ID
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
    },
  });
}

// Customer Management
export function useCustomers() {
  const { actor, isFetching } = useActor();

  return useQuery<Customer[]>({
    queryKey: ['customers'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllCustomers();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddCustomer() {
  const queryClient = useQueryClient();
  const { actor } = useActor();

  return useMutation({
    mutationFn: async (customer: { id: bigint; name: string; contactDetails: string; preferences: string }) => {
      if (!actor) throw new Error('Actor not initialized');
      const result = await actor.addCustomer(customer.id, customer.name, customer.contactDetails, customer.preferences);
      if (!result) throw new Error('Failed to add customer');
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
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
    },
  });
}

export function useEditSubscription() {
  const queryClient = useQueryClient();
  const { actor } = useActor();

  return useMutation({
    mutationFn: async (params: {
      id: bigint;
      updatedName: string;
      updatedCustomerName: string;
      updatedPhoneNumber: string;
      updatedPlanType: string;
      updatedBowlSize: SaladBowlType;
      updatedPrice: bigint;
      updatedIsPaid: boolean;
      updatedStartDate: Time;
      updatedEndDate: Time;
      updatedRemainingDeliveries: bigint;
    }) => {
      if (!actor) throw new Error('Actor not initialized');
      const result = await actor.editSubscription(
        params.id,
        params.updatedName,
        params.updatedCustomerName,
        params.updatedPhoneNumber,
        params.updatedPlanType,
        params.updatedBowlSize,
        params.updatedPrice,
        params.updatedIsPaid,
        params.updatedStartDate,
        params.updatedEndDate,
        params.updatedRemainingDeliveries
      );
      if (!result) throw new Error('Failed to edit subscription');
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscriptions'] });
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
    onError: () => {
      toast.error('Failed to add ingredient');
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
    onError: () => {
      toast.error('Failed to update ingredient');
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
    onError: () => {
      toast.error('Failed to delete ingredient');
    },
  });
}

// Stock Management
export function useGetStockStatus() {
  const { actor, isFetching } = useActor();

  return useQuery<StockStatus[]>({
    queryKey: ['stockStatus'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getStockStatus();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useRecordStockIn() {
  const queryClient = useQueryClient();
  const { actor } = useActor();

  return useMutation({
    mutationFn: async (params: {
      ingredientName: string;
      quantity: bigint;
      supplier: string;
      costPrice: bigint;
      unitType: string;
    }) => {
      if (!actor) throw new Error('Actor not initialized');
      const result = await actor.recordStockIn(
        params.ingredientName,
        params.quantity,
        params.supplier,
        params.costPrice,
        params.unitType
      );
      if (!result) throw new Error('Failed to record stock in');
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ingredients'] });
      queryClient.invalidateQueries({ queryKey: ['stockStatus'] });
      queryClient.invalidateQueries({ queryKey: ['stockTransactions'] });
    },
  });
}

export function useRecordStockOut() {
  const queryClient = useQueryClient();
  const { actor } = useActor();

  return useMutation({
    mutationFn: async (params: {
      ingredientName: string;
      quantity: bigint;
      reason: string;
    }) => {
      if (!actor) throw new Error('Actor not initialized');
      const result = await actor.recordStockOut(
        params.ingredientName,
        params.quantity,
        params.reason
      );
      if (!result) throw new Error('Failed to record stock out');
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ingredients'] });
      queryClient.invalidateQueries({ queryKey: ['stockStatus'] });
      queryClient.invalidateQueries({ queryKey: ['stockTransactions'] });
    },
  });
}

export function useRecordWriteOff() {
  const queryClient = useQueryClient();
  const { actor } = useActor();

  return useMutation({
    mutationFn: async (params: {
      ingredientName: string;
      quantity: bigint;
      reason: string;
    }) => {
      if (!actor) throw new Error('Actor not initialized');
      const result = await actor.recordWriteOff(
        params.ingredientName,
        params.quantity,
        params.reason
      );
      if (!result) throw new Error('Failed to record write-off');
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ingredients'] });
      queryClient.invalidateQueries({ queryKey: ['stockStatus'] });
      queryClient.invalidateQueries({ queryKey: ['stockTransactions'] });
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
  });
}
