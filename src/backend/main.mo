import Time "mo:core/Time";
import Array "mo:core/Array";
import Text "mo:core/Text";
import List "mo:core/List";
import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Order "mo:core/Order";
import Iter "mo:core/Iter";
import Int "mo:core/Int";

actor {
  type Ingredient = {
    name : Text;
    quantity : Nat; // grams or units
    costPricePerUnit : Nat;
    supplierName : Text;
    lowStockThreshold : Nat;
  };

  type SaladBowlType = {
    #gm250;
    #gm350;
    #gm500;
    #custom;
  };

  type Recipe = [(Text, Nat)]; // ingredient name and quantity needed

  type SaladBowl = {
    name : Text;
    bowlType : SaladBowlType;
    price : Nat;
    recipe : Recipe;
    active : Bool;
  };

  type Invoice = {
    customerName : Text;
    itemsOrdered : [(Text, Nat)]; // product name and quantity
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

  type Customer = {
    id : Nat;
    name : Text;
    contactDetails : Text;
    preferences : Text;
  };

  type SubscriptionPlan = {
    #weekly : { duration : Nat };
    #monthly : { duration : Nat };
  };

  type Subscription = {
    id : Nat;
    name : Text; // New field for custom subscription name/label
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

  let ingredientInventory = Map.empty<Text, Ingredient>();
  let saladBowlProducts = Map.empty<Text, SaladBowl>();
  let invoices = List.empty<Invoice>();
  let customers = Map.empty<Nat, Customer>();

  let availablePlans = Map.fromIter<Text, SubscriptionPlan>(
    [
      ("weekly", #weekly({ duration = 6 })),
      ("monthly", #monthly({ duration = 24 })),
    ].values()
  );

  let subscriptions = Map.empty<Nat, Subscription>();

  let products = Map.empty<Nat, SaladBowl>();
  var nextProductId = 0;

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

  public shared ({ caller }) func deductIngredientsOnSale(invoice : Invoice) : async () {
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

  public shared ({ caller }) func getAnalyticsMetrics() : async {
    dailySales : Nat;
    weeklySales : Nat;
    monthlySales : Nat;
    cashFlow : Nat;
    dailyExpenses : Nat;
  } {
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

  public shared ({ caller }) func toggleSaladBowlAvailability(bowlName : Text, isAvailable : Bool) : async () {
    switch (saladBowlProducts.get(bowlName)) {
      case (null) {};
      case (?bowl) {
        let updatedBowl = { bowl with active = isAvailable };
        saladBowlProducts.add(bowlName, updatedBowl);
      };
    };
  };

  public shared ({ caller }) func editSaladBowlRecipe(bowlName : Text, newRecipe : Recipe) : async Bool {
    switch (saladBowlProducts.get(bowlName)) {
      case (null) { false };
      case (?bowl) {
        let updatedBowl = { bowl with recipe = newRecipe };
        saladBowlProducts.add(bowlName, updatedBowl);
        true;
      };
    };
  };

  public shared ({ caller }) func weeklyPlanDuration() : async Nat {
    6;
  };

  public shared ({ caller }) func monthlyPlanDuration() : async Nat {
    24;
  };

  public shared ({ caller }) func bowlSizes() : async {
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

  public shared ({ caller }) func addCustomer(id : Nat, name : Text, contactDetails : Text, preferences : Text) : async Bool {
    let newCustomer = {
      id;
      name;
      contactDetails;
      preferences;
    };
    customers.add(id, newCustomer);
    true;
  };

  public query ({ caller }) func getAllCustomers() : async [Customer] {
    customers.values().toArray();
  };

  public shared ({ caller }) func createSubscription(id : Nat, name : Text, customerName : Text, phoneNumber : Text, planType : Text, bowlSize : SaladBowlType, price : Nat, isPaid : Bool, startDate : Time.Time, endDate : Time.Time, remainingDeliveries : Int) : async Bool {
    let newSubscription = {
      id;
      name; // Custom subscription name/label
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

  public query ({ caller }) func getAllSubscriptions() : async [Subscription] {
    subscriptions.values().toArray();
  };

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

  public shared ({ caller }) func deleteSubscription(id : Nat) : async Bool {
    switch (subscriptions.get(id)) {
      case (null) { false };
      case (?_) {
        subscriptions.remove(id);
        true;
      };
    };
  };

  public shared ({ caller }) func addProduct(product : SaladBowl) : async Nat {
    let id = nextProductId;
    products.add(id, product);
    nextProductId += 1;
    id;
  };

  public shared ({ caller }) func updateProduct(id : Nat, updatedProduct : SaladBowl) : async Bool {
    switch (products.get(id)) {
      case (null) { false };
      case (?_) {
        products.add(id, updatedProduct);
        true;
      };
    };
  };

  public shared ({ caller }) func deleteProduct(id : Nat) : async Bool {
    switch (products.get(id)) {
      case (null) { false };
      case (?_) {
        products.remove(id);
        true;
      };
    };
  };

  public query ({ caller }) func getProduct(id : Nat) : async ?SaladBowl {
    products.get(id);
  };

  public query ({ caller }) func getAllActiveProducts() : async [SaladBowl] {
    let productsArray = products.toArray().map(
      func((_, product)) { product }
    );
    let filteredProducts = productsArray.filter(func(product) { product.active });
    filteredProducts;
  };

  public query ({ caller }) func getAllProductsWithInactive() : async [SaladBowl] {
    products.values().toArray();
  };
};
