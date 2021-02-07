export class OnboardLicenseeRequest {
    facilityName!: string;
    facilityAddress!: string;
    licenses!: string[];

    constructor(){}

    OnboardLicenseeRequest(facilityName: string, facilityAddress: string, licenses: string[]) {
        this.facilityName = facilityName;
        this.facilityAddress = facilityAddress;
        this.licenses = licenses;
    }
    
}

export class ProcessHempCOARequest {
    accountId!: string;
    date!: string;

    constructor(){}

    ProcessHempCOARequest(accountId: string, date: string) {
        this.accountId = accountId;
        this.date = date;
    }
    
}