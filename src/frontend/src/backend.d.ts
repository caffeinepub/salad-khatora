import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
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
export type Time = bigint;
export interface SaladBowl {
    active: boolean;
    name: string;
    price: bigint;
    bowlType: SaladBowlType;
    recipe: Recipe;
}
export type Recipe = Array<[string, bigint]>;
export interface Customer {
    id: bigint;
    name: string;
    preferences: string;
    contactDetails: string;
}
export interface Invoice {
    customerName: string;
    timestamp: Time;
    paymentMode: string;
    totalPrice: bigint;
    itemsOrdered: Array<[string, bigint]>;
}
export enum SaladBowlType {
    custom = "custom",
    gm250 = "gm250",
    gm350 = "gm350",
    gm500 = "gm500"
}
export interface backendInterface {
    addCustomer(id: bigint, name: string, contactDetails: string, preferences: string): Promise<boolean>;
    addProduct(product: SaladBowl): Promise<bigint>;
    bowlSizes(): Promise<{
        gm250: boolean;
        gm350: boolean;
        gm500: boolean;
    }>;
    createSubscription(id: bigint, name: string, customerName: string, phoneNumber: string, planType: string, bowlSize: SaladBowlType, price: bigint, isPaid: boolean, startDate: Time, endDate: Time, remainingDeliveries: bigint): Promise<boolean>;
    deductIngredientsOnSale(invoice: Invoice): Promise<void>;
    deleteProduct(id: bigint): Promise<boolean>;
    deleteSubscription(id: bigint): Promise<boolean>;
    editSaladBowlRecipe(bowlName: string, newRecipe: Recipe): Promise<boolean>;
    editSubscription(id: bigint, updatedName: string, updatedCustomerName: string, updatedPhoneNumber: string, updatedPlanType: string, updatedBowlSize: SaladBowlType, updatedPrice: bigint, updatedIsPaid: boolean, updatedStartDate: Time, updatedEndDate: Time, updatedRemainingDeliveries: bigint): Promise<boolean>;
    getAllActiveProducts(): Promise<Array<SaladBowl>>;
    getAllCustomers(): Promise<Array<Customer>>;
    getAllProductsWithInactive(): Promise<Array<SaladBowl>>;
    getAllSubscriptions(): Promise<Array<Subscription>>;
    getAnalyticsMetrics(): Promise<{
        monthlySales: bigint;
        dailySales: bigint;
        weeklySales: bigint;
        cashFlow: bigint;
        dailyExpenses: bigint;
    }>;
    getProduct(id: bigint): Promise<SaladBowl | null>;
    monthlyPlanDuration(): Promise<bigint>;
    toggleSaladBowlAvailability(bowlName: string, isAvailable: boolean): Promise<void>;
    updateProduct(id: bigint, updatedProduct: SaladBowl): Promise<boolean>;
    weeklyPlanDuration(): Promise<bigint>;
}
