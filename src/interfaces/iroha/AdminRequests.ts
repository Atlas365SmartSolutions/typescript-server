export class OnboardLicenseeRequest {
    accountId!: string;

    constructor(){}

    OnboardLicenseeRequest(accountId: string) {
        this.accountId = accountId;
    }
    
}