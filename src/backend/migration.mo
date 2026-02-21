import Map "mo:core/Map";

module {
  type OldCustomer = {
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
    reference : Text;
  };

  type OldActor = {
    customers : Map.Map<Nat, OldCustomer>;
  };

  type NewCustomer = {
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

  type NewActor = {
    customers : Map.Map<Nat, NewCustomer>;
  };

  public func run(old : OldActor) : NewActor {
    let newCustomers = old.customers.map<Nat, OldCustomer, NewCustomer>(
      func(_id, oldCustomer) {
        {
          id = oldCustomer.id;
          name = oldCustomer.name;
          phone = oldCustomer.phone;
          email = oldCustomer.email;
          address = oldCustomer.address;
          preferences = oldCustomer.preferences;
          gender = oldCustomer.gender;
          age = oldCustomer.age;
          heightCm = oldCustomer.heightCm;
          weightKg = oldCustomer.weightKg;
          calculatedBMI = oldCustomer.calculatedBMI;
        };
      }
    );
    { customers = newCustomers };
  };
};
