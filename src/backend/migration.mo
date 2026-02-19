import Map "mo:core/Map";
import Nat "mo:core/Nat";
import List "mo:core/List";

module {
  type OldActor = {
    ingredientInventory : Map.Map<Text, {
      name : Text;
      quantity : Nat;
      costPricePerUnit : Nat;
      supplierName : Text;
      lowStockThreshold : Nat;
    }>;
    saladBowlProducts : Map.Map<Text, {
      name : Text;
      bowlType : {
        #gm250;
        #gm350;
        #gm500;
        #custom;
      };
      price : Nat;
      recipe : [(Text, Nat)];
      active : Bool;
    }>;
    invoices : List.List<{
      customerName : Text;
      itemsOrdered : [(Text, Nat)];
      totalPrice : Nat;
      paymentMode : Text;
      timestamp : Int;
    }>;
    customers : Map.Map<Nat, {
      id : Nat;
      name : Text;
      contactDetails : Text;
      preferences : Text;
    }>;
    availablePlans : Map.Map<Text, {
      #weekly : { duration : Nat };
      #monthly : { duration : Nat };
    }>;
    subscriptions : Map.Map<Nat, {
      id : Nat;
      name : Text;
      customerName : Text;
      phoneNumber : Text;
      planType : Text;
      bowlSize : { #gm250; #gm350; #gm500; #custom };
      price : Nat;
      isPaid : Bool;
      startDate : Int;
      endDate : Int;
      remainingDeliveries : Int;
    }>;
    products : Map.Map<Nat, {
      name : Text;
      bowlType : { #gm250; #gm350; #gm500; #custom };
      price : Nat;
      recipe : [(Text, Nat)];
      active : Bool;
    }>;
    nextProductId : Nat;
  };

  type NewActor = {
    ingredientInventory : Map.Map<Text, {
      name : Text;
      quantity : Nat;
      costPricePerUnit : Nat;
      supplierName : Text;
      lowStockThreshold : Nat;
      unitType : Text;
    }>;
    saladBowlProducts : Map.Map<Text, {
      name : Text;
      bowlType : {
        #gm250;
        #gm350;
        #gm500;
        #custom;
      };
      price : Nat;
      recipe : [(Text, Nat)];
      active : Bool;
    }>;
    invoices : List.List<{
      customerName : Text;
      itemsOrdered : [(Text, Nat)];
      totalPrice : Nat;
      paymentMode : Text;
      timestamp : Int;
    }>;
    customers : Map.Map<Nat, {
      id : Nat;
      name : Text;
      contactDetails : Text;
      preferences : Text;
    }>;
    availablePlans : Map.Map<Text, {
      #weekly : { duration : Nat };
      #monthly : { duration : Nat };
    }>;
    subscriptions : Map.Map<Nat, {
      id : Nat;
      name : Text;
      customerName : Text;
      phoneNumber : Text;
      planType : Text;
      bowlSize : { #gm250; #gm350; #gm500; #custom };
      price : Nat;
      isPaid : Bool;
      startDate : Int;
      endDate : Int;
      remainingDeliveries : Int;
    }>;
    products : Map.Map<Nat, {
      name : Text;
      bowlType : {
        #gm250;
        #gm350;
        #gm500;
        #custom;
      };
      price : Nat;
      recipe : [(Text, Nat)];
      active : Bool;
    }>;
    nextProductId : Nat;
  };

  public func run(old : OldActor) : NewActor {
    {
      ingredientInventory = old.ingredientInventory.map(
        func(_k, oldIngredient) {
          {
            oldIngredient with
            unitType = "gram";
          };
        }
      );
      saladBowlProducts = old.saladBowlProducts;
      invoices = old.invoices;
      customers = old.customers;
      availablePlans = old.availablePlans;
      subscriptions = old.subscriptions;
      products = old.products;
      nextProductId = old.nextProductId;
    };
  };
};
