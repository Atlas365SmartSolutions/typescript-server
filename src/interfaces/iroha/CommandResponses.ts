
export class CommandSuccessResponse {

    txHash!: string;
    status!: string;

    constructor(){}

    CommandSuccessResponse(txHash: string, status: string) {
        this.txHash = txHash;
        this.status = status;
    }
}

export class CommandErrorResponse {

    error!: string;
    status!: string;

    constructor(){}

    CommandSuccessResponse(error: string, status: string) {
        this.error = error;
        this.status = status;
    }
}