import Time "mo:core/Time";
import List "mo:core/List";
import Map "mo:core/Map";
import Text "mo:core/Text";
import Int "mo:core/Int";
import Iter "mo:core/Iter";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";
import Migration "migration";

// Specify data migration function in with-clause
(with migration = Migration.run)
actor {
  // Integrate authorization system
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  type Ingredient = {
    name : Text;
    quantity : Nat;
    costPricePerUnit : Nat;
    supplierName : Text;
    lowStockThreshold : Nat;
    unitType : Text;
  };

  type SaladBowlType = { #gm250; #gm350; #gm500; #custom };
  type Recipe = [(Text, Nat)];
  type Product = {
    name : Text;
    bowlType : SaladBowlType;
    price : Nat;
    recipe : Recipe;
    active : Bool;
    category : Text;
    calories : Nat;
    protein : Nat;
    carbs : Nat;
    fat : Nat;
    fiber : Nat;
    sugar : Nat;
  };

  type Invoice = {
    customerName : Text;
    itemsOrdered : [(Text, Nat)];
    totalPrice : Nat;
    paymentMode : Text;
    timestamp : Time.Time;
  };

  type ReportType = { #inventory; #sales; #subscriptions; #expenses };

  type Customer = {
    id : Nat;
    name : Text;
    phone : Text;
    email : Text;
    address : Text;
    preferences : Text;
    gender : Text;
    age : Nat;
    heightCm : Float;
    weightKg : Float;
    calculatedBMI : Float;
  };

  type UserProfile = {
    customerId : Nat;
    name : Text;
    phone : Text;
    email : Text;
    address : Text;
    preferences : Text;
    gender : Text;
    age : Nat;
    heightCm : Float;
    weightKg : Float;
    calculatedBMI : Float;
  };

  type SubscriptionPlan = { #weekly : { duration : Nat }; #monthly : { duration : Nat } };
  type StockTransactionType = { #stockIn; #stockOut; #writeOff };
  type StockTransaction = {
    transactionId : Nat;
    ingredientName : Text;
    quantity : Nat;
    transactionType : StockTransactionType;
    reason : Text;
    date : Time.Time;
    supplier : ?Text;
    costPrice : ?Nat;
    unitType : Text;
  };

  type StockStatus = {
    ingredientName : Text;
    currentQuantity : Nat;
    quantityInStock : Nat;
    unitType : Text;
    costPricePerUnit : Nat;
    isLowStock : Bool;
  };

  type InventoryItem = {
    ingredientName : Text;
    quantityInStock : Nat;
    unitType : Text;
  };

  type Subscription = {
    id : Nat;
    name : Text;
    customerName : Text;
    phoneNumber : Text;
    planType : Text;
    bowlSize : SaladBowlType;
    price : Nat;
    isPaid : Bool;
    startDate : Time.Time;
    endDate : Time.Time;
    remainingDeliveries : Int;
  };

  type Order = {
    orderId : Nat;
    customerId : Nat;
    customerName : Text;
    phone : Text;
    deliveryAddress : Text;
    items : [(Text, Nat)];
    orderTotal : Nat;
    paymentMode : Text;
    orderStatus : Text;
    orderDate : Time.Time;
  };

  let ingredientInventory = Map.empty<Text, Ingredient>();
  var invoices = List.empty<Invoice>();
  let customers = Map.empty<Nat, Customer>();
  let orders = Map.empty<Nat, Order>();
  let userProfiles = Map.empty<Principal, UserProfile>();
  let principalToCustomerId = Map.empty<Principal, Nat>();
  let saladBowlProducts = Map.empty<Text, Product>();

  let availablePlans = Map.fromIter<Text, SubscriptionPlan>(
    [("weekly", #weekly({ duration = 6 })), ("monthly", #monthly({ duration = 24 }))].values()
  );

  let subscriptions = Map.empty<Nat, Subscription>();
  let products = Map.empty<Nat, Product>();
  var nextProductId = 0;
  var nextOrderId = 0;
  var nextCustomerId = 0;
  let stockTransactions = Map.empty<Nat, StockTransaction>();
  var nextStockTransactionId = 0;

  func getPeriodRange(daysBack : Int) : (Time.Time, Time.Time) {
    let endTime = Time.now();
    let nanosecondsInDay : Int = 24 * 60 * 60 * 1000000000;
    let startTime = endTime - (nanosecondsInDay * daysBack);
    (startTime, endTime);
  };

  // User profile management functions (required by frontend)
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };

    // Check if user already has a profile with a customerId assigned
    switch (principalToCustomerId.get(caller)) {
      case (?existingCustomerId) {
        // User already has a customerId - they cannot change it
        if (existingCustomerId != profile.customerId) {
          Runtime.trap("Unauthorized: Cannot change customer ID");
        };
      };
      case null {
        // New user - assign the next available customerId, ignoring the provided one
        let assignedCustomerId = nextCustomerId;
        nextCustomerId += 1;
        
        principalToCustomerId.add(caller, assignedCustomerId);
        
        let newProfile = {
          customerId = assignedCustomerId;
          name = profile.name;
          phone = profile.phone;
          email = profile.email;
          address = profile.address;
          preferences = profile.preferences;
          gender = profile.gender;
          age = profile.age;
          heightCm = profile.heightCm;
          weightKg = profile.weightKg;
          calculatedBMI = profile.calculatedBMI;
        };
        
        userProfiles.add(caller, newProfile);
        
        customers.add(assignedCustomerId, {
          id = assignedCustomerId;
          name = profile.name;
          phone = profile.phone;
          email = profile.email;
          address = profile.address;
          preferences = profile.preferences;
          gender = profile.gender;
          age = profile.age;
          heightCm = profile.heightCm;
          weightKg = profile.weightKg;
          calculatedBMI = profile.calculatedBMI;
        });
        return;
      };
    };

    // Update existing profile (customerId already validated above)
    userProfiles.add(caller, profile);
    
    customers.add(profile.customerId, {
      id = profile.customerId;
      name = profile.name;
      phone = profile.phone;
      email = profile.email;
      address = profile.address;
      preferences = profile.preferences;
      gender = profile.gender;
      age = profile.age;
      heightCm = profile.heightCm;
      weightKg = profile.weightKg;
      calculatedBMI = profile.calculatedBMI;
    });
  };

  // Customer Management - Admin only
  public shared ({ caller }) func addCustomer(customer : Customer) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add customers");
    };
    let id = nextCustomerId;
    customers.add(id, { customer with id = id });
    nextCustomerId += 1;
    id;
  };

  public shared ({ caller }) func updateCustomer(id : Nat, customer : Customer) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update customers");
    };
    customers.add(id, customer);
  };

  public shared ({ caller }) func deleteCustomer(id : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete customers");
    };
    customers.remove(id);
  };

  public query ({ caller }) func getCustomer(id : Nat) : async ?Customer {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view customers");
    };
    customers.get(id);
  };

  public query ({ caller }) func getAllCustomers() : async [(Nat, Customer)] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view customers");
    };
    customers.entries().toArray();
  };

  // Product Management - Admin only for modifications
  public shared ({ caller }) func addProduct(product : Product) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add products");
    };
    let id = nextProductId;
    products.add(id, product);
    nextProductId += 1;
    id;
  };

  public shared ({ caller }) func updateProduct(id : Nat, product : Product) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update products");
    };
    products.add(id, product);
  };

  public shared ({ caller }) func deleteProduct(id : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete products");
    };
    products.remove(id);
  };

  public query func getProduct(id : Nat) : async ?Product {
    products.get(id);
  };

  public query func getAllProducts() : async [(Nat, Product)] {
    products.entries().toArray();
  };

  public shared ({ caller }) func bulkUploadProducts(productArray : [Product]) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can use bulk upload functionality");
    };

    var uploadedCount = 0;
    for (product in productArray.values()) {
      let id = nextProductId;
      products.add(id, product);
      nextProductId += 1;
      uploadedCount += 1;
    };
    uploadedCount;
  };

  // Order Management
  public shared ({ caller }) func createOrder(order : Order) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create orders");
    };

    let ?customerId = principalToCustomerId.get(caller) else {
      Runtime.trap("User must have a customer profile to create orders");
    };

    if (order.customerId != customerId and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only create orders for yourself");
    };

    let id = nextOrderId;
    orders.add(id, { order with orderId = id });
    nextOrderId += 1;
    id;
  };

  public shared ({ caller }) func updateOrderStatus(orderId : Nat, status : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update order status");
    };

    let ?order = orders.get(orderId) else {
      Runtime.trap("Order not found");
    };

    orders.add(orderId, { order with orderStatus = status });
  };

  public query ({ caller }) func getOrder(orderId : Nat) : async ?Order {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view orders");
    };

    let ?order = orders.get(orderId) else {
      return null;
    };

    let ?customerId = principalToCustomerId.get(caller) else {
      if (AccessControl.isAdmin(accessControlState, caller)) {
        return ?order;
      };
      Runtime.trap("User profile not found");
    };

    if (order.customerId != customerId and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own orders");
    };

    ?order;
  };

  public query ({ caller }) func getMyOrders() : async [Order] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view orders");
    };

    let ?customerId = principalToCustomerId.get(caller) else {
      return [];
    };

    let myOrders = orders.entries().filter(
      func((_, order)) { order.customerId == customerId }
    ).toArray();

    myOrders.values().map<(Nat, Order), Order>(func((_, order)) { order }).toArray();
  };

  public query ({ caller }) func getAllOrders() : async [(Nat, Order)] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view all orders");
    };
    orders.entries().toArray();
  };

  // Subscription Management
  public shared ({ caller }) func createSubscription(subscription : Subscription) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can create subscriptions");
    };

    let id = subscription.id;
    subscriptions.add(id, subscription);
    id;
  };

  public shared ({ caller }) func updateSubscription(id : Nat, subscription : Subscription) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update subscriptions");
    };
    subscriptions.add(id, subscription);
  };

  public shared ({ caller }) func deleteSubscription(id : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete subscriptions");
    };
    subscriptions.remove(id);
  };

  public query ({ caller }) func getSubscription(id : Nat) : async ?Subscription {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view subscriptions");
    };
    subscriptions.get(id);
  };

  public query ({ caller }) func getAllSubscriptions() : async [(Nat, Subscription)] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view all subscriptions");
    };
    subscriptions.entries().toArray();
  };

  // Inventory Management - Admin only
  public shared ({ caller }) func addIngredient(ingredient : Ingredient) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add ingredients");
    };
    ingredientInventory.add(ingredient.name, ingredient);
  };

  public shared ({ caller }) func updateIngredient(name : Text, ingredient : Ingredient) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update ingredients");
    };
    ingredientInventory.add(name, ingredient);
  };

  public shared ({ caller }) func deleteIngredient(name : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete ingredients");
    };
    ingredientInventory.remove(name);
  };

  public query ({ caller }) func getIngredient(name : Text) : async ?Ingredient {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view ingredients");
    };
    ingredientInventory.get(name);
  };

  public query ({ caller }) func getAllIngredients() : async [(Text, Ingredient)] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view ingredients");
    };
    ingredientInventory.entries().toArray();
  };

  public query ({ caller }) func getInventoryStatus() : async [StockStatus] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view inventory status");
    };

    ingredientInventory.entries().map<(Text, Ingredient), StockStatus>(
      func((name, ingredient)) {
        {
          ingredientName = name;
          currentQuantity = ingredient.quantity;
          quantityInStock = ingredient.quantity;
          unitType = ingredient.unitType;
          costPricePerUnit = ingredient.costPricePerUnit;
          isLowStock = ingredient.quantity <= ingredient.lowStockThreshold;
        };
      }
    ).toArray();
  };

  // Stock Transaction Management - Admin only
  public shared ({ caller }) func recordStockTransaction(
    transaction : StockTransaction
  ) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can record stock transactions");
    };

    let id = nextStockTransactionId;
    stockTransactions.add(id, { transaction with transactionId = id });
    nextStockTransactionId += 1;

    // Update ingredient inventory
    let ?ingredient = ingredientInventory.get(transaction.ingredientName) else {
      Runtime.trap("Ingredient not found");
    };

    let newQuantity = switch (transaction.transactionType) {
      case (#stockIn) { ingredient.quantity + transaction.quantity };
      case (#stockOut or #writeOff) {
        if (ingredient.quantity < transaction.quantity) {
          Runtime.trap("Insufficient stock");
        };
        ingredient.quantity - transaction.quantity;
      };
    };

    ingredientInventory.add(transaction.ingredientName, { ingredient with quantity = newQuantity });
    id;
  };

  public query ({ caller }) func getStockTransaction(id : Nat) : async ?StockTransaction {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view stock transactions");
    };
    stockTransactions.get(id);
  };

  public query ({ caller }) func getAllStockTransactions() : async [(Nat, StockTransaction)] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view stock transactions");
    };
    stockTransactions.entries().toArray();
  };

  // Invoice Management - Admin only for creation
  public shared ({ caller }) func createInvoice(invoice : Invoice) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can create invoices");
    };
    invoices.add(invoice);
  };

  public query ({ caller }) func getAllInvoices() : async [Invoice] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view all invoices");
    };
    invoices.toArray();
  };

  public query ({ caller }) func getInvoicesByPeriod(daysBack : Int) : async [Invoice] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view invoices");
    };

    let (startTime, endTime) = getPeriodRange(daysBack);
    invoices.filter(
      func(invoice) { invoice.timestamp >= startTime and invoice.timestamp <= endTime }
    ).toArray();
  };

  func findProductByName(productName : Text) : ?Product {
    for ((_, product) in products.entries()) {
      if (product.name == productName) { return ?product };
    };
    null;
  };
};
