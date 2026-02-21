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
export interface Ingredient {
    unitType: string;
    lowStockThreshold: bigint;
    supplierName: string;
    name: string;
    quantity: bigint;
    costPricePerUnit: bigint;
}
export type Recipe = Array<[string, bigint]>;
export interface Product {
    fat: bigint;
    fiber: bigint;
    active: boolean;
    carbs: bigint;
    calories: bigint;
    name: string;
    sugar: bigint;
    category: string;
    price: bigint;
    bowlType: SaladBowlType;
    protein: bigint;
    recipe: Recipe;
}
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
    addCustomer(customer: Customer): Promise<bigint>;
    addIngredient(ingredient: Ingredient): Promise<void>;
    addProduct(product: Product): Promise<bigint>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    bulkUploadProducts(productArray: Array<Product>): Promise<bigint>;
    createInvoice(invoice: Invoice): Promise<void>;
    createOrder(order: Order): Promise<bigint>;
    createSubscription(subscription: Subscription): Promise<bigint>;
    deleteCustomer(id: bigint): Promise<void>;
    deleteIngredient(name: string): Promise<void>;
    deleteProduct(id: bigint): Promise<void>;
    deleteSubscription(id: bigint): Promise<void>;
    getAllCustomers(): Promise<Array<[bigint, Customer]>>;
    getAllIngredients(): Promise<Array<[string, Ingredient]>>;
    getAllInvoices(): Promise<Array<Invoice>>;
    getAllOrders(): Promise<Array<[bigint, Order]>>;
    getAllProducts(): Promise<Array<[bigint, Product]>>;
    getAllStockTransactions(): Promise<Array<[bigint, StockTransaction]>>;
    getAllSubscriptions(): Promise<Array<[bigint, Subscription]>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getCustomer(id: bigint): Promise<Customer | null>;
    getIngredient(name: string): Promise<Ingredient | null>;
    getInventoryStatus(): Promise<Array<StockStatus>>;
    getInvoicesByPeriod(daysBack: bigint): Promise<Array<Invoice>>;
    getMyOrders(): Promise<Array<Order>>;
    getOrder(orderId: bigint): Promise<Order | null>;
    getProduct(id: bigint): Promise<Product | null>;
    getStockTransaction(id: bigint): Promise<StockTransaction | null>;
    getSubscription(id: bigint): Promise<Subscription | null>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    recordStockTransaction(transaction: StockTransaction): Promise<bigint>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    updateCustomer(id: bigint, customer: Customer): Promise<void>;
    updateIngredient(name: string, ingredient: Ingredient): Promise<void>;
    updateOrderStatus(orderId: bigint, status: string): Promise<void>;
    updateProduct(id: bigint, product: Product): Promise<void>;
    updateSubscription(id: bigint, subscription: Subscription): Promise<void>;
}
