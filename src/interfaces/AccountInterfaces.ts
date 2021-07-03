export class OnboardFarmerRequest {
    farm!: Farm;
    totalAcres!: number;
    numberOfFields!: number;
    acresPerField!: [number];
    hempLicense!: boolean;
    harvester!: boolean;
    dryer!: Dryer;
    combine!: Combine;
    seeder!: boolean;
    storage!: Storage;
    irohaKeys?: [keyPair]  
}

export class OnboardEcoPointsMemberRequest {
    consumerId!: string;
    firstname!: string;
    lastname!: string;
    email!: string;
    ecoPointsValue!: string;
    city!: string;
    dob!: string;
    password!: string;
}

export class Farm {
    farmerName!: string;
    farmAddress!: string;
    farmBusinessName!: string;
}
export enum FuelType {
    DISEL = 'DISEL',
    PETROLIUM = 'PETROLIUM'

}

export enum CropStatus {
    SEEDS_NOT_SOWN = 'SEEDS_NOT_SOWN'
}
export enum ProductionType {
    HURD = 'HURD'
}
export class Harvest {
    harvesterName!: string;
      harvesterId!: string;
      decorticatorId!: string;
      vehicleId!: string;
      fuelType!: FuelType;
      fuelConsumption!: number; //in Liters
      hoursOperating!: number;
      harvestKilometres!: number;
      decorticatorHours!: number;      
      season!: number;
}

export class InitalizeFieldRequest {
    farm!: Farm;
    fields!: [Field];
    
}
export class GeoLocation {
    longitude!: number;
    latitude!: number
}

export class Field {
    fieldId!: string;
    isFieldForLease!: boolean;
    plantedSeedType!: string;
    seedSupplier!: string;
    harvest!: Harvest;
    cropStatus!: CropStatus;
    acreage!: number;
    geoLocation!:GeoLocation;
    hempProductId!: [string];
    weight!: number;
    co2avg!: number;
    plannedProductionType!: ProductionType
}

export class Dryer {
    available!: boolean;
    capacity!: number;
    unit!: string; //kg
}

export class Combine {
    available!: boolean;
    willingTo!: boolean;
}

export class Storage {
    available!: boolean;
    distanceFromFarm!: boolean;
    unit!: string; //km
    type!: HempStorageType; //AUGER or CONVEYER
}

export class keyPair {
    pubKey!: string;
    privKey!: string;
    name!: string;
}



export enum HempStorageType {
    AUGER = 'AUGER',
    CONVEYER = 'CONVEYER'
}