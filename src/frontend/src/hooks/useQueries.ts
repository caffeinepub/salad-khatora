import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { Product, UserProfile, Customer, Order, Invoice, Ingredient, StockTransaction, StockStatus, StockTransactionType } from '../backend';
import { toast } from 'sonner';

// Product Management - Bulk Upload Only
export function useBulkUploadProducts() {
  const queryClient = useQueryClient();
  const { actor } = useActor();

  return useMutation({
    mutationFn: async (products: Product[]) => {
      if (!actor) throw new Error('Actor not initialized');
      const uploadedCount = await actor.bulkUploadProducts(products);
      return uploadedCount;
    },
    onSuccess: (uploadedCount) => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success(`Successfully uploaded ${uploadedCount} menu items`);
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to upload menu items');
    },
  });
}

// User Profile Management
export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<UserProfile | null>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
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
      toast.success('Profile saved successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to save profile');
    },
  });
}

// Customer Management
export function useAllCustomers() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Array<[bigint, Customer]>>({
    queryKey: ['customers'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getAllCustomers();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useAddCustomer() {
  const queryClient = useQueryClient();
  const { actor } = useActor();

  return useMutation({
    mutationFn: async (customer: Customer) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.addCustomer(customer);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      toast.success('Customer added successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to add customer');
    },
  });
}

export function useDeleteCustomer() {
  const queryClient = useQueryClient();
  const { actor } = useActor();

  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error('Actor not initialized');
      await actor.deleteCustomer(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      toast.success('Customer deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to delete customer');
    },
  });
}

// Product Queries
export function useAllProducts() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Array<[bigint, Product]>>({
    queryKey: ['products'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getAllProducts();
    },
    enabled: !!actor && !actorFetching,
  });
}

// Invoice Management
export function useCreateInvoice() {
  const queryClient = useQueryClient();
  const { actor } = useActor();

  return useMutation({
    mutationFn: async (invoice: Invoice) => {
      if (!actor) throw new Error('Actor not initialized');
      await actor.createInvoice(invoice);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      toast.success('Invoice created successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to create invoice');
    },
  });
}

export function useAllInvoices() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Invoice[]>({
    queryKey: ['invoices'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getAllInvoices();
    },
    enabled: !!actor && !actorFetching,
  });
}

// Order Management
export function useAllOrders() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Array<[bigint, Order]>>({
    queryKey: ['orders'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getAllOrders();
    },
    enabled: !!actor && !actorFetching,
  });
}

// Inventory Management
export function useGetAllIngredients() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Array<[string, Ingredient]>>({
    queryKey: ['ingredients'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getAllIngredients();
    },
    enabled: !!actor && !actorFetching,
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
      queryClient.invalidateQueries({ queryKey: ['inventoryStatus'] });
      toast.success('Ingredient added successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to add ingredient');
    },
  });
}

export function useUpdateIngredient() {
  const queryClient = useQueryClient();
  const { actor } = useActor();

  return useMutation({
    mutationFn: async ({ name, ingredient }: { name: string; ingredient: Ingredient }) => {
      if (!actor) throw new Error('Actor not initialized');
      await actor.updateIngredient(name, ingredient);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ingredients'] });
      queryClient.invalidateQueries({ queryKey: ['inventoryStatus'] });
      toast.success('Ingredient updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update ingredient');
    },
  });
}

export function useDeleteIngredient() {
  const queryClient = useQueryClient();
  const { actor } = useActor();

  return useMutation({
    mutationFn: async (name: string) => {
      if (!actor) throw new Error('Actor not initialized');
      await actor.deleteIngredient(name);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ingredients'] });
      queryClient.invalidateQueries({ queryKey: ['inventoryStatus'] });
      toast.success('Ingredient deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to delete ingredient');
    },
  });
}

export function useGetInventoryStatus() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<StockStatus[]>({
    queryKey: ['inventoryStatus'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getInventoryStatus();
    },
    enabled: !!actor && !actorFetching,
  });
}

// Stock Transaction Management
export function useRecordStockTransaction() {
  const queryClient = useQueryClient();
  const { actor } = useActor();

  return useMutation({
    mutationFn: async (transaction: StockTransaction) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.recordStockTransaction(transaction);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stockTransactions'] });
      queryClient.invalidateQueries({ queryKey: ['ingredients'] });
      queryClient.invalidateQueries({ queryKey: ['inventoryStatus'] });
      toast.success('Stock transaction recorded successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to record stock transaction');
    },
  });
}

export function useGetAllStockTransactions() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Array<[bigint, StockTransaction]>>({
    queryKey: ['stockTransactions'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getAllStockTransactions();
    },
    enabled: !!actor && !actorFetching,
  });
}

// Helper function to check transaction type
function isTransactionType(transactionType: StockTransactionType, type: 'stockIn' | 'stockOut' | 'writeOff'): boolean {
  // StockTransactionType is an enum, so we check the string value
  const typeStr = transactionType as any;
  return typeStr === type;
}

export function useGetStockTransactionsByType(type: 'stockIn' | 'stockOut' | 'writeOff') {
  const { data: allTransactions, isLoading } = useGetAllStockTransactions();

  const filteredTransactions = allTransactions?.filter(([_, transaction]) => {
    return isTransactionType(transaction.transactionType, type);
  });

  return {
    data: filteredTransactions,
    isLoading,
  };
}
