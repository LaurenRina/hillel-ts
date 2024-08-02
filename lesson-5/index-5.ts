abstract class Vehicle {
  constructor(public brand: string) {}
  abstract getType(): string;
}

interface VehicleJSON {
  type: string;
  brand: string;
  seats?: number;
  capacity?: number;
  hasSidecar?: boolean;
}

class Car extends Vehicle {
  constructor(brand: string, public seats: number) {
    super(brand);
  }

  getType(): string {
    return "car";
  }

  performAction(): string {
    return `Car ${this.brand} with ${this.seats} seats is starting its engine.`
  }
}

class Truck extends Vehicle {
  constructor(brand: string, public capacity: number) {
    super(brand);
  }

  getType(): string {
    return "truck";
  }

  getAction(): string {
    return `Truck ${this.brand} with capacity ${this.capacity} kg is loading cargo.`
  }
}

class Motorcycle extends Vehicle {
  constructor(brand: string, public hasSidecar: boolean) {
    super(brand);
  }

  getType(): string {
    return "motorcycle";
  }

  action(): string {
    const sidecarStatus = this.hasSidecar ? "with" : "without";
    return `Motorcycle ${this.brand} ${sidecarStatus} sidecar is revving its engine.`
  }
}

class VehicleValidator {
  public static isCar(vehicle: Vehicle): vehicle is Car {
    return vehicle instanceof Car;
  }

  public static isTruck(vehicle: Vehicle): vehicle is Truck {
    return vehicle instanceof Truck;
  }

  public static isMotorcycle(vehicle: Vehicle): vehicle is Motorcycle {
    return vehicle instanceof Motorcycle;
  }
}

class Vehiclevehicle {
  private vehicles: Vehicle[] = [];

  constructor() {
    this.initialize();
  }

  addVehicle(vehicle: Vehicle): void {
    this.vehicles.push(vehicle);
    this.saveToLocalStorage();
  }

  performVehicleActions(vehicle: Car | Truck | Motorcycle): void {
    if (VehicleValidator.isCar(vehicle)) {
      vehicle.performAction();
    } else if (VehicleValidator.isTruck(vehicle)) {
      vehicle.getAction();
    } else if (VehicleValidator.isMotorcycle(vehicle)) {
      vehicle.action();
    } else {
      throw new Error(`Unhandled vehicle type: ${vehicle}`);
    }
  }

  private saveToLocalStorage(): void {
    const vehiclesJSON = this.vehicles.map((vehicle) => ({
      type: vehicle.getType(),
      ...vehicle,
    }));
    localStorage.setItem("vehicles", JSON.stringify(vehiclesJSON));
  }

  private loadFromLocalStorage(): void {
    const vehiclesJSON = JSON.parse(localStorage.getItem("vehicles") || "[]");
    this.vehicles = vehiclesJSON.map((vehicle: VehicleJSON) => this.vehicleFromJSON(vehicle));
  }

  private vehicleFromJSON(vehicle: VehicleJSON): Vehicle {
    switch (vehicle.type) {
      case "car":
        return new Car(vehicle.brand, vehicle.seats!);
      case "truck":
        return new Truck(vehicle.brand, vehicle.capacity!);
      case "motorcycle":
        return new Motorcycle(vehicle.brand, vehicle.hasSidecar!);
      default:
        throw new Error(`Unknown vehicle type: ${vehicle.type}`);
    }
  }

   public initialize(): void {
    this.loadFromLocalStorage();
  }
}

