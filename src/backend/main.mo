import Time "mo:core/Time";
import Array "mo:core/Array";
import List "mo:core/List";
import Map "mo:core/Map";
import Text "mo:core/Text";
import Nat "mo:core/Nat";
import Order "mo:core/Order";
import Int "mo:core/Int";
import Iter "mo:core/Iter";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";

import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";
import Migration "migration";

// Specify the data migration function in with-clause
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

  type SaladBowlType = {
    #gm250;
    #gm350;
    #gm500;
    #custom;
  };

  type Recipe = [(Text, Nat)];

  type SaladBowl = {
    name : Text;
    bowlType : SaladBowlType;
    price : Nat;
    recipe : Recipe;
    active : Bool;
  };

  type Invoice = {
    customerName : Text;
    itemsOrdered : [(Text, Nat)];
    totalPrice : Nat;
    paymentMode : Text;
    timestamp : Time.Time;
  };

  type ReportType = {
    #inventory;
    #sales;
    #subscriptions;
    #expenses;
  };

  // Extend Customer with health info
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

  // User profile type for authenticated users
  public type UserProfile = {
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

  type SubscriptionPlan = {
    #weekly : { duration : Nat };
    #monthly : { duration : Nat };
  };

  type StockTransactionType = {
    #stockIn;
    #stockOut;
    #writeOff;
  };

  // Enforce stricter visibility for StockTransaction
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
  let saladBowlProducts = Map.empty<Text, SaladBowl>();
  let invoices = List.empty<Invoice>();
  let customers = Map.empty<Nat, Customer>();
  let orders = Map.empty<Nat, Order>();
  let userProfiles = Map.empty<Principal, UserProfile>();
  let principalToCustomerId = Map.empty<Principal, Nat>();

  let availablePlans = Map.fromIter<Text, SubscriptionPlan>(
    [
      ("weekly", #weekly({ duration = 6 })),
      ("monthly", #monthly({ duration = 24 })),
    ].values()
  );

  let subscriptions = Map.empty<Nat, Subscription>();
  let products = Map.empty<Nat, SaladBowl>();
  var nextProductId = 0;
  var nextOrderId = 0;
  var nextCustomerId = 0;

  let stockTransactions = Map.empty<Nat, StockTransaction>();
  var nextStockTransactionId = 0;

  func compareInvoices(a : Invoice, b : Invoice) : Order.Order {
    Int.compare(a.timestamp, b.timestamp);
  };

  func calculateSalesForPeriod(startTime : Time.Time, endTime : Time.Time) : Nat {
    var totalSales = 0;
    for (invoice in invoices.values()) {
      if (invoice.timestamp >= startTime and invoice.timestamp <= endTime) {
        totalSales += invoice.totalPrice;
      };
    };
    totalSales;
  };

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
    userProfiles.add(caller, profile);
    principalToCustomerId.add(caller, profile.customerId);

    // Also update the customer record
    let customer = {
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
    };
    customers.add(profile.customerId, customer);
  };

  // Admin-only: Invoice processing
  public shared ({ caller }) func deductIngredientsOnSale(invoice : Invoice) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can process invoices");
    };
    for ((bowlName, quantity) in invoice.itemsOrdered.values()) {
      switch (saladBowlProducts.get(bowlName)) {
        case (null) {};
        case (?bowl) {
          for ((ingredientName, neededQty) in bowl.recipe.values()) {
            let totalQty = if (quantity < 1) { 1 } else {
              neededQty * quantity;
            };
            switch (ingredientInventory.get(ingredientName)) {
              case (null) {};
              case (?ingredient) {
                let updatedIngredient = {
                  ingredient with
                  quantity =
                    if (ingredient.quantity >= totalQty) {
                      ingredient.quantity - totalQty;
                    } else { 0 };
                };
                ingredientInventory.add(ingredientName, updatedIngredient);
              };
            };
          };
        };
      };
    };
    invoices.add(invoice);
  };

  // Admin-only: Analytics
  public query ({ caller }) func getAnalyticsMetrics() : async {
    dailySales : Nat;
    weeklySales : Nat;
    monthlySales : Nat;
    cashFlow : Nat;
    dailyExpenses : Nat;
  } {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view analytics");
    };
    let dayRange = getPeriodRange(1);
    let weekRange = getPeriodRange(7);
    let monthRange = getPeriodRange(30);

    let dailySales = calculateSalesForPeriod(dayRange.0, dayRange.1);
    let weeklySales = calculateSalesForPeriod(weekRange.0, weekRange.1);
    let monthlySales = calculateSalesForPeriod(monthRange.0, monthRange.1);

    {
      dailySales;
      weeklySales;
      monthlySales;
      cashFlow = 0;
      dailyExpenses = 0;
    };
  };

  // Admin-only: Product availability
  public shared ({ caller }) func toggleSaladBowlAvailability(bowlName : Text, isAvailable : Bool) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can toggle product availability");
    };
    switch (saladBowlProducts.get(bowlName)) {
      case (null) {};
      case (?bowl) {
        let updatedBowl = { bowl with active = isAvailable };
        saladBowlProducts.add(bowlName, updatedBowl);
      };
    };
  };

  // Admin-only: Recipe editing
  public shared ({ caller }) func editSaladBowlRecipe(bowlName : Text, newRecipe : Recipe) : async Bool {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can edit recipes");
    };
    switch (saladBowlProducts.get(bowlName)) {
      case (null) { false };
      case (?bowl) {
        let updatedBowl = { bowl with recipe = newRecipe };
        saladBowlProducts.add(bowlName, updatedBowl);
        true;
      };
    };
  };

  // Public: Plan information
  public query func weeklyPlanDuration() : async Nat {
    6;
  };

  public query func monthlyPlanDuration() : async Nat {
    24;
  };

  public query func bowlSizes() : async {
    gm250 : Bool;
    gm350 : Bool;
    gm500 : Bool;
  } {
    {
      gm250 = true;
      gm350 = true;
      gm500 = true;
    };
  };

  // Admin-only: Add customer
  public shared ({ caller }) func addCustomer(name : Text, phone : Text, email : Text, address : Text, preferences : Text, gender : Text, age : Nat, heightCm : Float, weightKg : Float, calculatedBMI : Float) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add customers");
    };
    let id = nextCustomerId;
    nextCustomerId += 1;
    let newCustomer = {
      id;
      name;
      phone;
      email;
      address;
      preferences;
      gender;
      age;
      heightCm;
      weightKg;
      calculatedBMI;
    };
    customers.add(id, newCustomer);
    id;
  };

  // Admin-only: Get all customers
  public query ({ caller }) func getAllCustomers() : async [Customer] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view all customers");
    };
    customers.values().toArray();
  };

  // User can view own profile, admin can view any
  public query ({ caller }) func getCustomerProfile(customerId : Nat) : async ?Customer {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view profiles");
    };

    // Check if user is viewing their own profile
    switch (principalToCustomerId.get(caller)) {
      case (?userCustomerId) {
        if (userCustomerId != customerId and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Can only view your own profile");
        };
      };
      case (null) {
        // If no mapping exists, only admin can view
        if (not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Can only view your own profile");
        };
      };
    };

    customers.get(customerId);
  };

  // Admin-only: Subscription management
  public shared ({ caller }) func createSubscription(
    id : Nat,
    name : Text,
    customerName : Text,
    phoneNumber : Text,
    planType : Text,
    bowlSize : SaladBowlType,
    price : Nat,
    isPaid : Bool,
    startDate : Time.Time,
    endDate : Time.Time,
    remainingDeliveries : Int,
  ) : async Bool {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can create subscriptions");
    };
    let newSubscription = {
      id;
      name;
      customerName;
      phoneNumber;
      planType;
      bowlSize;
      price;
      isPaid;
      startDate;
      endDate;
      remainingDeliveries;
    };
    subscriptions.add(id, newSubscription);
    true;
  };

  // Admin-only: View all subscriptions
  public query ({ caller }) func getAllSubscriptions() : async [Subscription] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view all subscriptions");
    };
    subscriptions.values().toArray();
  };

  // Admin-only: Edit subscription
  public shared ({ caller }) func editSubscription(
    id : Nat,
    updatedName : Text,
    updatedCustomerName : Text,
    updatedPhoneNumber : Text,
    updatedPlanType : Text,
    updatedBowlSize : SaladBowlType,
    updatedPrice : Nat,
    updatedIsPaid : Bool,
    updatedStartDate : Time.Time,
    updatedEndDate : Time.Time,
    updatedRemainingDeliveries : Int,
  ) : async Bool {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can edit subscriptions");
    };
    switch (subscriptions.get(id)) {
      case (null) { false };
      case (?_) {
        let updatedSubscription = {
          id;
          name = updatedName;
          customerName = updatedCustomerName;
          phoneNumber = updatedPhoneNumber;
          planType = updatedPlanType;
          bowlSize = updatedBowlSize;
          price = updatedPrice;
          isPaid = updatedIsPaid;
          startDate = updatedStartDate;
          endDate = updatedEndDate;
          remainingDeliveries = updatedRemainingDeliveries;
        };
        subscriptions.add(id, updatedSubscription);
        true;
      };
    };
  };

  // Admin-only: Delete subscription
  public shared ({ caller }) func deleteSubscription(id : Nat) : async Bool {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete subscriptions");
    };
    switch (subscriptions.get(id)) {
      case (null) { false };
      case (?_) {
        subscriptions.remove(id);
        true;
      };
    };
  };

  // User can view own orders, admin can view any customer's orders
  public query ({ caller }) func getCustomerOrders(customerId : Nat) : async [Order] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view orders");
    };

    // Check if user is viewing their own orders
    switch (principalToCustomerId.get(caller)) {
      case (?userCustomerId) {
        if (userCustomerId != customerId and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Can only view your own orders");
        };
      };
      case (null) {
        // If no mapping exists, only admin can view
        if (not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Can only view your own orders");
        };
      };
    };

    let customerOrders = orders.values().toArray().filter(
      func(order) { order.customerId == customerId }
    );
    customerOrders;
  };

  // Admin-only: Product management
  public shared ({ caller }) func addProduct(product : SaladBowl) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add products");
    };
    let id = nextProductId;
    products.add(id, product);
    nextProductId += 1;
    id;
  };

  public shared ({ caller }) func updateProduct(id : Nat, updatedProduct : SaladBowl) : async Bool {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update products");
    };
    switch (products.get(id)) {
      case (null) { false };
      case (?_) {
        products.add(id, updatedProduct);
        true;
      };
    };
  };

  public shared ({ caller }) func deleteProduct(id : Nat) : async Bool {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete products");
    };
    switch (products.get(id)) {
      case (null) { false };
      case (?_) {
        products.remove(id);
        true;
      };
    };
  };

  // Public: View product (customers need to see products)
  public query func getProduct(id : Nat) : async ?SaladBowl {
    products.get(id);
  };

  // Public: View active products (customers need to see available products)
  public query func getAllActiveProducts() : async [SaladBowl] {
    let productsArray = products.toArray().map(
      func((_, product)) { product }
    );
    let filteredProducts = productsArray.filter(func(product) { product.active });
    filteredProducts;
  };

  // Admin-only: View all products including inactive
  public query ({ caller }) func getAllProductsWithInactive() : async [SaladBowl] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view all products");
    };
    products.values().toArray();
  };

  // Admin-only: Ingredient management
  public shared ({ caller }) func addIngredient(ingredient : Ingredient) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add ingredients");
    };
    ingredientInventory.add(ingredient.name, ingredient);
  };

  public shared ({ caller }) func updateIngredient(name : Text, updatedIngredient : Ingredient) : async Bool {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update ingredients");
    };
    switch (ingredientInventory.get(name)) {
      case (null) { false };
      case (?_) {
        ingredientInventory.add(name, updatedIngredient);
        true;
      };
    };
  };

  public shared ({ caller }) func deleteIngredient(name : Text) : async Bool {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete ingredients");
    };
    switch (ingredientInventory.get(name)) {
      case (null) { false };
      case (?_) {
        ingredientInventory.remove(name);
        true;
      };
    };
  };

  // Admin-only: View ingredient
  public query ({ caller }) func getIngredient(name : Text) : async ?Ingredient {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view ingredients");
    };
    ingredientInventory.get(name);
  };

  // Admin-only: View all ingredients
  public query ({ caller }) func getAllIngredients() : async [Ingredient] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view all ingredients");
    };
    ingredientInventory.values().toArray();
  };

  // Admin-only: Stock management
  public shared ({ caller }) func recordStockIn(ingredientName : Text, quantity : Nat, supplier : Text, costPrice : Nat, unitType : Text) : async Bool {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can record stock in");
    };
    let adjustedQuantity = if (quantity < 1) { 1 } else { quantity };

    let transaction = {
      transactionId = nextStockTransactionId;
      ingredientName;
      quantity = adjustedQuantity;
      transactionType = #stockIn;
      reason = "Stock In";
      date = Time.now();
      supplier = ?supplier;
      costPrice = ?costPrice;
      unitType;
    };

    stockTransactions.add(nextStockTransactionId, transaction);
    nextStockTransactionId += 1;

    switch (ingredientInventory.get(ingredientName)) {
      case (null) {
        let newIngredient = {
          name = ingredientName;
          quantity = adjustedQuantity;
          costPricePerUnit = costPrice;
          supplierName = supplier;
          lowStockThreshold = 1;
          unitType;
        };
        ingredientInventory.add(ingredientName, newIngredient);
      };
      case (?ingredient) {
        let updatedIngredient = {
          ingredient with
          quantity = ingredient.quantity + adjustedQuantity;
          costPricePerUnit = costPrice;
        };
        ingredientInventory.add(ingredientName, updatedIngredient);
      };
    };
    true;
  };

  public shared ({ caller }) func recordStockOut(ingredientName : Text, quantity : Nat, reason : Text) : async Bool {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can record stock out");
    };
    let adjustedQuantity = if (quantity < 1) { 1 } else { quantity };

    let transaction = {
      transactionId = nextStockTransactionId;
      ingredientName;
      quantity = adjustedQuantity;
      transactionType = #stockOut;
      reason;
      date = Time.now();
      supplier = null;
      costPrice = null;
      unitType = "";
    };

    stockTransactions.add(nextStockTransactionId, transaction);
    nextStockTransactionId += 1;

    switch (ingredientInventory.get(ingredientName)) {
      case (null) { false };
      case (?ingredient) {
        let updatedQuantity = if (ingredient.quantity > adjustedQuantity) {
          ingredient.quantity - adjustedQuantity;
        } else { 0 };

        let updatedIngredient = {
          ingredient with
          quantity = updatedQuantity;
        };
        ingredientInventory.add(ingredientName, updatedIngredient);
        true;
      };
    };
  };

  public shared ({ caller }) func recordWriteOff(ingredientName : Text, quantity : Nat, reason : Text) : async Bool {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can record write-offs");
    };
    let adjustedQuantity = if (quantity < 1) { 1 } else { quantity };

    let transaction = {
      transactionId = nextStockTransactionId;
      ingredientName;
      quantity = adjustedQuantity;
      transactionType = #writeOff;
      reason;
      date = Time.now();
      supplier = null;
      costPrice = null;
      unitType = "";
    };

    stockTransactions.add(nextStockTransactionId, transaction);
    nextStockTransactionId += 1;

    switch (ingredientInventory.get(ingredientName)) {
      case (null) { false };
      case (?ingredient) {
        let updatedQuantity = if (ingredient.quantity > adjustedQuantity) {
          ingredient.quantity - adjustedQuantity;
        } else { 0 };

        let updatedIngredient = {
          ingredient with
          quantity = updatedQuantity;
        };
        ingredientInventory.add(ingredientName, updatedIngredient);
        true;
      };
    };
  };

  // Admin-only: Stock status
  public query ({ caller }) func getStockStatus() : async [StockStatus] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view stock status");
    };
    ingredientInventory.values().toArray().map(func(ingredient) {
      {
        ingredientName = ingredient.name;
        currentQuantity = ingredient.quantity;
        quantityInStock = ingredient.quantity;
        unitType = ingredient.unitType;
        costPricePerUnit = ingredient.costPricePerUnit;
        isLowStock = ingredient.quantity < ingredient.lowStockThreshold;
      };
    });
  };

  // Admin-only: Stock transactions
  public query ({ caller }) func getAllStockTransactions() : async [StockTransaction] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view stock transactions");
    };
    stockTransactions.values().toArray();
  };

  // Admin-only: Inventory status
  public query ({ caller }) func getInventoryStatus() : async {
    totalValue : Nat;
    items : [InventoryItem];
  } {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view inventory status");
    };
    var totalValue = 0;
    let inventoryItems = ingredientInventory.values().toArray().map(func(ingredient) {
      totalValue += ingredient.quantity * ingredient.costPricePerUnit;
      {
        ingredientName = ingredient.name;
        quantityInStock = ingredient.quantity;
        unitType = ingredient.unitType;
      };
    });
    {
      totalValue;
      items = inventoryItems;
    };
  };

  // Admin-only: Stock transactions by type
  public query ({ caller }) func getStockTransactionsByType(transactionType : StockTransactionType) : async [StockTransaction] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view stock transactions");
    };
    let filteredTransactions = stockTransactions.values().toArray().filter(
      func(transaction) { transaction.transactionType == transactionType }
    );
    filteredTransactions;
  };

  // User can create own order, admin can create any order
  public shared ({ caller }) func addOrder(
    customerId : Nat,
    customerName : Text,
    phone : Text,
    deliveryAddress : Text,
    items : [(Text, Nat)],
    orderTotal : Nat,
    paymentMode : Text,
    orderStatus : Text,
  ) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can create orders");
    };

    // Check if user is creating order for themselves
    switch (principalToCustomerId.get(caller)) {
      case (?userCustomerId) {
        if (userCustomerId != customerId and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Can only create orders for yourself");
        };
      };
      case (null) {
        // If no mapping exists, only admin can create orders
        if (not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Can only create orders for yourself");
        };
      };
    };

    let orderId = nextOrderId;
    nextOrderId += 1;
    let order = {
      orderId;
      customerId;
      customerName;
      phone;
      deliveryAddress;
      items;
      orderTotal;
      paymentMode;
      orderStatus;
      orderDate = Time.now();
    };
    orders.add(orderId, order);
    orderId;
  };

  // User can view own order, admin can view any order
  public query ({ caller }) func getOrder(orderId : Nat) : async ?Order {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view orders");
    };

    switch (orders.get(orderId)) {
      case (null) { null };
      case (?order) {
        // Check if user owns this order
        switch (principalToCustomerId.get(caller)) {
          case (?userCustomerId) {
            if (userCustomerId != order.customerId and not AccessControl.isAdmin(accessControlState, caller)) {
              Runtime.trap("Unauthorized: Can only view your own orders");
            };
          };
          case (null) {
            // If no mapping exists, only admin can view
            if (not AccessControl.isAdmin(accessControlState, caller)) {
              Runtime.trap("Unauthorized: Can only view your own orders");
            };
          };
        };
        ?order;
      };
    };
  };

  // Admin-only: View all orders
  public query ({ caller }) func getAllOrders() : async [Order] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view all orders");
    };
    orders.values().toArray();
  };

  // Admin-only: Update order status
  public shared ({ caller }) func updateOrderStatus(orderId : Nat, newStatus : Text) : async Bool {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update order status");
    };
    switch (orders.get(orderId)) {
      case (null) { false };
      case (?order) {
        let updatedOrder = { order with orderStatus = newStatus };
        orders.add(orderId, updatedOrder);
        true;
      };
    };
  };
};
