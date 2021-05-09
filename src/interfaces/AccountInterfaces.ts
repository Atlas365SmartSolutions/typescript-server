export class OnboardFarmerRequest {
    name!: string;
    farmAddress!: string;
    farmBusinessName!: string;
    totalAcres!: number;
    numberOfFields!: number;
    hempLicense!: boolean;
    harvester!: boolean;
    dryer!: Dryer;
    combine!: Combine;
    seeder!: boolean;
    storage!: Storage;
    irohaKeys?: [keyPair]  
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