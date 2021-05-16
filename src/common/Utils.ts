import { BatchBuilder } from "iroha-helpers-ts/lib/chain";
import cryptoHelper from "iroha-helpers-ts/lib/cryptoHelper";
import { IrohaErrorResponse, IrohaSuccessResponse } from "../interfaces/iroha/IrohaResponses";
import { IROHA_ADMIN_PRIM_KEY } from "./Constants";

export class utils {
    constructor(){}
}
export enum LicenseType {
 JBF = 'Just Bio Fibre',
 CANURTA = 'Canurta',
 CANURTASYRUP = 'Canurta Syrup'
}

export enum Status {
    COMMITTED = "committed",
}

export function escapeJSON(request: any){
    var myJSONString = JSON.stringify(request);
    var searchVal = /("|“|”)/g;
    var replaceVal = '`';
    var myEscapedJSONString = myJSONString
    .replace(searchVal,replaceVal);
    return myEscapedJSONString;
};

export function escapeJSONv2(request: any){
    
}

export function returnJSON(request: any){
    var myJSONString = JSON.stringify(request);
    var searchVal = /("{)/g;
     var searchVal2 = /(}")/g;
    var searchVal3 = /(`)/g;
    var replaceVal = '{';
    var replaceVal2 = '}';
    var replaceVal3 = '"'; 
    var myEscapedJSONString = JSON.parse(myJSONString
     .replace(searchVal,replaceVal)
     .replace(searchVal2,replaceVal2)
     .replace(searchVal3,replaceVal3)
    )
    return myEscapedJSONString;
};

export function setIrohaSuccessResp(resp: IrohaSuccessResponse){
    let irohaSuccessResponse = new IrohaSuccessResponse();
    irohaSuccessResponse = resp;
    console.log("sending iroha response :: %s\n", JSON.stringify(irohaSuccessResponse));
    return irohaSuccessResponse;  
}

export function setIrohaErrorResp(err: any){
    let irohaErrorResponse = new IrohaErrorResponse();
    irohaErrorResponse.error = err.message;
    irohaErrorResponse.status = err.message.split("actual=")[1];

    console.log('Received iroha error: ', irohaErrorResponse);
    return irohaErrorResponse;          
}

export function createKeyPair(){
    let keyPair = cryptoHelper.generateKeyPair();
    return keyPair;
}

export function createIrohaBatch(batchBuilder:BatchBuilder,key:string){
    let batch = batchBuilder.setBatchMeta(0);

    batch.txs.forEach((tx,i,_) => {
        batch = batch.sign([key],i);            
    })

    return batch;
}
