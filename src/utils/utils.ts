export class utils {
    
    constructor(){
        
    }


}
export function escapeJSON(batchRequest: any){
    var myJSONString = JSON.stringify(batchRequest);
    var searchVal = /("|“|”)/g;
    var replaceVal = '\\"';
    var myEscapedJSONString = myJSONString.replace(searchVal,replaceVal);
    return myEscapedJSONString;
};
export function returnJSON(batchRequest: any){
    var myJSONString = JSON.stringify(batchRequest);
    var searchVal = /(\|\\)/g;
    var replaceVal = '';
    var myEscapedJSONString = myJSONString.replace(searchVal,replaceVal);
    return myEscapedJSONString;
};