import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export type Time = bigint;
export interface SaladBowl {
    active: boolean;
    name: string;
    price: bigint;
    bowlType: SaladBowlType;
    recipe: Recipe;
}
export interface StockStatus {
    unitType: string;
    quantityInStock: bigint;
    isLowStock: boolean;
    currentQuantity: bigint;
    ingredientName: string;
    costPricePerUnit: bigint;
}
export interface Invoice {
    customerName: string;
    timestamp: Time;
    paymentMode: string;
    totalPrice: bigint;
    itemsOrdered: Array<[string, bigint]>;
}
export interface StockTransaction {
    unitType: string;
    transactionType: StockTransactionType;
    supplier?: string;
    date: Time;
    quantity: bigint;
    ingredientName: string;
    costPrice?: bigint;
    transactionId: bigint;
    reason: string;
}
export interface Order {
    customerName: string;
    deliveryAddress: string;
    orderStatus: string;
    orderTotal: bigint;
    orderDate: Time;
    orderId: bigint;
    paymentMode: string;
    customerId: bigint;
    phone: string;
    items: Array<[string, bigint]>;
}
export interface Customer {
    id: bigint;
    age: bigint;
    heightCm: number;
    name: string;
    email: string;
    preferences: string;
    weightKg: number;
    address: string;
    gender: string;
    calculatedBMI: number;
    phone: string;
}
export interface Subscription {
    id: bigint;
    customerName: string;
    endDate: Time;
    name: string;
    remainingDeliveries: bigint;
    isPaid: boolean;
    phoneNumber: string;
    price: bigint;
    planType: string;
    bowlSize: SaladBowlType;
    startDate: Time;
}
export interface InventoryItem {
    unitType: string;
    quantityInStock: bigint;
    ingredientName: string;
}
export interface Ingredient {
    unitType: string;
    lowStockThreshold: bigint;
    supplierName: string;
    name: string;
    quantity: bigint;
    costPricePerUnit: bigint;
}
export type Recipe = Array<[string, bigint]>;
export interface UserProfile {
    age: bigint;
    heightCm: number;
    name: string;
    email: string;
    preferences: string;
    weightKg: number;
    address: string;
    gender: string;
    calculatedBMI: number;
    customerId: bigint;
    phone: string;
}
export enum SaladBowlType {
    custom = "custom",
    gm250 = "gm250",
    gm350 = "gm350",
    gm500 = "gm500"
}
export enum StockTransactionType {
    writeOff = "writeOff",
    stockOut = "stockOut",
    stockIn = "stockIn"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addCustomer(name: string, phone: string, email: string, address: string, preferences: string, gender: string, age: bigint, heightCm: number, weightKg: number, calculatedBMI: number): Promise<bigint>;
    addIngredient(ingredient: Ingredient): Promise<void>;
    addOrder(customerId: bigint, customerName: string, phone: string, deliveryAddress: string, items: Array<[string, bigint]>, orderTotal: bigint, paymentMode: string, orderStatus: string): Promise<bigint>;
    addProduct(product: SaladBowl): Promise<bigint>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    bowlSizes(): Promise<{
        gm250: boolean;
        gm350: boolean;
        gm500: boolean;
    }>;
    createSubscription(id: bigint, name: string, customerName: string, phoneNumber: string, planType: string, bowlSize: SaladBowlType, price: bigint, isPaid: boolean, startDate: Time, endDate: Time, remainingDeliveries: bigint): Promise<boolean>;
    deductIngredientsOnSale(invoice: Invoice): Promise<void>;
    deleteIngredient(name: string): Promise<boolean>;
    deleteProduct(id: bigint): Promise<boolean>;
    deleteSubscription(id: bigint): Promise<boolean>;
    editSaladBowlRecipe(bowlName: string, newRecipe: Recipe): Promise<boolean>;
    editSubscription(id: bigint, updatedName: string, updatedCustomerName: string, updatedPhoneNumber: string, updatedPlanType: string, updatedBowlSize: SaladBowlType, updatedPrice: bigint, updatedIsPaid: boolean, updatedStartDate: Time, updatedEndDate: Time, updatedRemainingDeliveries: bigint): Promise<boolean>;
    getAllActiveProducts(): Promise<Array<SaladBowl>>;
    getAllCustomers(): Promise<Array<Customer>>;
    getAllIngredients(): Promise<Array<Ingredient>>;
    getAllOrders(): Promise<Array<Order>>;
    getAllProductsWithInactive(): Promise<Array<SaladBowl>>;
    getAllStockTransactions(): Promise<Array<StockTransaction>>;
    getAllSubscriptions(): Promise<Array<Subscription>>;
    getAnalyticsMetrics(): Promise<{
        monthlySales: bigint;
        dailySales: bigint;
        weeklySales: bigint;
        cashFlow: bigint;
        dailyExpenses: bigint;
    }>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getCustomerOrders(customerId: bigint): Promise<Array<Order>>;
    getCustomerProfile(customerId: bigint): Promise<Customer | null>;
    getIngredient(name: string): Promise<Ingredient | null>;
    getInventoryStatus(): Promise<{
        totalValue: bigint;
        items: Array<InventoryItem>;
    }>;
    getOrder(orderId: bigint): Promise<Order | null>;
    getProduct(id: bigint): Promise<SaladBowl | null>;
    getStockStatus(): Promise<Array<StockStatus>>;
    getStockTransactionsByType(transactionType: StockTransactionType): Promise<Array<StockTransaction>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    monthlyPlanDuration(): Promise<bigint>;
    recordStockIn(ingredientName: string, quantity: bigint, supplier: string, costPrice: bigint, unitType: string): Promise<boolean>;
    recordStockOut(ingredientName: string, quantity: bigint, reason: string): Promise<boolean>;
    recordWriteOff(ingredientName: string, quantity: bigint, reason: string): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    toggleSaladBowlAvailability(bowlName: string, isAvailable: boolean): Promise<void>;
    updateIngredient(name: string, updatedIngredient: Ingredient): Promise<boolean>;
    updateOrderStatus(orderId: bigint, newStatus: string): Promise<boolean>;
    updateProduct(id: bigint, updatedProduct: SaladBowl): Promise<boolean>;
    weeklyPlanDuration(): Promise<bigint>;
}
