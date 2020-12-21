export class utils {
    
    constructor(){
        
    }


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