// REQUEST INTERFACE
export class AddAssetQuantityRequest {

    assetId!: string;
    amount!: number;

    constructor(){}

    AddAssetQuantityRequest(assetId: string, amount: number) {
        this.assetId = assetId;
        this.amount = amount;
    }
}
