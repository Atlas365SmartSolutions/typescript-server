import { CommandErrorResponse, CommandSuccessResponse } from "../interfaces/iroha/CommandResponses";

export class utils {
    constructor(){}
}

export function escapeJSON(request: any){
    var myJSONString = JSON.stringify(request);
    var searchVal = /("|“|”)/g;
    var replaceVal = '`';
    var myEscapedJSONString = myJSONString
    .replace(searchVal,replaceVal);
    return myEscapedJSONString;
};

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

export function setIrohaSuccessResp(resp: CommandSuccessResponse){
    let commandSuccessResponse = new CommandSuccessResponse();
    commandSuccessResponse = resp;
    console.log("sending command response for addAssetQuantity :: %s\n", JSON.stringify(commandSuccessResponse));
    return commandSuccessResponse;  
}

export function setIrohaErrorResp(err: any){
    let commandErrorResponse = new CommandErrorResponse();
    commandErrorResponse.error = err.message;
    commandErrorResponse.status = err.message.split("actual=")[1];

    console.log('Received error while sending command: ', commandErrorResponse);
    return commandErrorResponse;          
}