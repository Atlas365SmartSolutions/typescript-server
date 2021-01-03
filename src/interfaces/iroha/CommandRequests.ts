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

export class CommandResponse {

    txHash!: string;
    status!: string;

    constructor(){}

    CommandResponse(txHash: string, status: string) {
        this.txHash = txHash;
        this.status = status;
    }
}

export class CommandErrorResponse {

    error!: string;
    status!: string;

    constructor(){}

    CommandResponse(error: string, status: string) {
        this.error = error;
        this.status = status;
    }
}
