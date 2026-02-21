import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Array "mo:core/Array";

module {
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

  type OldActor = {
    customers : Map.Map<Nat, Customer>;
    nextCustomerId : Nat;
  };

  type NewActor = {
    customers : Map.Map<Nat, Customer>;
    nextCustomerId : Nat;
  };

  public func run(old : OldActor) : NewActor {
    var maxId = 0;
    let _ = old.customers.values().toArray().map(func(customer) {
      if (customer.id > maxId) {
        maxId := customer.id;
      };
    });
    { old with nextCustomerId = maxId + 1 };
  };
};
