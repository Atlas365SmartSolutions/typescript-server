import { request } from 'http';

class CanurtaMiddleware {

private accountId = 'admin@test';
private assetId = 'canurta@atlas';
  constructor() {

  }
  processHempCoa(batch:any){
    const req = request(
        {
          host: 'localhost',
          port: '3000',
          path: '/setAccountDetail',
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          }
        },
        response => {
          console.log(response.statusCode); // 200
        }
      );
      req.write(JSON.stringify({ accountId: this.accountId, batchExtraction: batch }));
       
      req.end();
  }
  millingExtraction(batch:any){
    const req = request(
        {
          host: 'localhost',
          port: '3000',
          path: '/setAccountDetail',
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          }
        },
        response => {
          console.log(response.statusCode); // 200
        }
      );
      req.write(JSON.stringify({ accountId: this.accountId, batchExtraction: batch }));
       
      req.end();
  }
  crudeExtraction(batch:any){
    const req = request(
        {
          host: 'localhost',
          port: '3000',
          path: '/setAccountDetail',
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          }
        },
        response => {
          console.log(response.statusCode); // 200
        }
      );
      req.write(JSON.stringify({ accountId: this.accountId, batchExtraction: batch }));
       
      req.end();
  }
  firstFiltration(batch:any){
    const req = request(
        {
          host: 'localhost',
          port: '3000',
          path: '/setAccountDetail',
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          }
        },
        response => {
          console.log(response.statusCode); // 200
        }
      );
      req.write(JSON.stringify({ accountId: this.accountId, batchExtraction: batch }));
       
      req.end();
  }
  enrichmentExtraction(batch:any){
    const req = request(
        {
          host: 'localhost',
          port: '3000',
          path: '/setAccountDetail',
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          }
        },
        response => {
          console.log(response.statusCode); // 200
        }
      );
      req.write(JSON.stringify({ accountId: this.accountId, batchExtraction: batch }));
       
      req.end();
  }
  secondFiltration(batch:any){
    const req = request(
        {
          host: 'localhost',
          port: '3000',
          path: '/setAccountDetail',
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          }
        },
        response => {
          console.log(response.statusCode); // 200
        }
      );
      req.write(JSON.stringify({ accountId: this.accountId, batchExtraction: batch }));
       
      req.end();
  }
  batchSignOff(batch:any){
    const req = request(
        {
          host: 'localhost',
          port: '3000',
          path: '/setAccountDetail',
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          }
        },
        response => {
          console.log(response.statusCode); // 200
        }
      );
      req.write(JSON.stringify({ accountId: this.accountId, batchExtraction: batch }));
       
      req.end();
  }
  processCanurtaSale(businessId:any, amount: any){
    const description = `Canurta Sale To: ${businessId}`;
    const req = request(
        {
          host: 'localhost',
          port: '3000',
          path: '/transferAsset',
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          }
        },
        response => {
          console.log(response.statusCode); // 200
        }
      ); 
      req.write(JSON.stringify(
          { accountId: this.accountId, destAccountId: 
            businessId, description: description, 
            assetId: this.assetId,
            amount: amount }));
       
      req.end();
  }
}

export = new CanurtaMiddleware();