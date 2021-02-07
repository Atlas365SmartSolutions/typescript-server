import { Request, Response, Router } from 'express';
import { createKeyPair } from '../common/Utils';
//import CommandsController from '../controllers/CommandsController';
//import QueriesController from '../controllers/QueriesController';
import { AppendRoleRequest, CreateAccountRequest, CreateAssetRequest, CreateDomainRequest } from '../interfaces/iroha/CommandRequests';
import { GetAccountRequest } from '../interfaces/iroha/QueryRequests';
import { IROHA_ACCOUNT_SUFFIX, IROHA_ADMIN_PRIM_KEY, IROHA_DOMAIN_ID, IROHA_PEER_ADDR, IROHA_ROLE_LICENSEE } from '../common/Constants';
import { TxBuilder,BatchBuilder } from 'iroha-helpers-ts/lib/chain'
import {
  CommandService_v1Client as CommandService,
  QueryService_v1Client as QueryService
} from 'iroha-helpers-ts/lib/proto/endpoint_pb_service'
import { NodeHttpTransport } from '@improbable-eng/grpc-web-node-http-transport';
import CommandsController = require('./CommandsController');
import QueriesController = require('./QueriesController');

class AdminController {
    private _router = Router();
    private commandsController = CommandsController;
    private queriesController = QueriesController;
    private commandService = new CommandService(IROHA_PEER_ADDR)



    get router() {
      return this._router;
    }

    constructor(){
        this._onboardLicensee();
        this._processHempCOA();
        this._generateKeyPair();
        this._testBatch();
    }

    private async _testBatch(){
      this._router.get('/testBatch', (req: Request, res: Response) => {
        const firstTx = new TxBuilder()
        .createAccount({
          accountName: 'user1',
          domainId: 'test',
          publicKey: '0000000000000000000000000000000000000000000000000000000000000000'
        })
        .addMeta('admin@test', 1)
        .tx

        const secondTx = new TxBuilder()
          .createAccount({
            accountName: 'user2',
            domainId: 'test',
            publicKey: '0000000000000000000000000000000000000000000000000000000000000000'
          })
          .addMeta('admin@test', 1)
          .tx

          new BatchBuilder([
            firstTx,
            secondTx
          ])
            .setBatchMeta(0)
            .sign([IROHA_ADMIN_PRIM_KEY], 0)
            .sign([IROHA_ADMIN_PRIM_KEY], 1)
            .send(this.commandService)
            .then(res => console.log(res))
            .catch(err => console.error(err))
      })
    }

    private async _onboardLicensee() {
      this._router.post('/onboardLicensee', (req: Request, res: Response) => {
          //let onboardLicenseeRequest = new onboardLicenseeRequest();
          let onboardLicenseeRequest = req.body;
          console.log("Incoming request for *onboardLicensee* ::: %s",onboardLicenseeRequest);
          let keypair = createKeyPair();
          //  let createDomainReq = new CreateDomainRequest(onboardLicenseeRequest.facilityName,IROHA_ROLE_LICENSEE);
          let createDomainReq = {"domainId":onboardLicenseeRequest.facilityName,"defaultRole":IROHA_ROLE_LICENSEE};

           let createAccountReq = new CreateAccountRequest(onboardLicenseeRequest.facilityName,IROHA_DOMAIN_ID,keypair.publicKey);
           let getAccountReq = new GetAccountRequest(onboardLicenseeRequest.facilityName+IROHA_ACCOUNT_SUFFIX);
          let appendRoleReq = new AppendRoleRequest(onboardLicenseeRequest.facilityName,IROHA_ROLE_LICENSEE);
          let createCanurtaLicenseAssetReq = new CreateAssetRequest("canurta",onboardLicenseeRequest.facilityName,0);
          let createCanurtaSyrupLicenseAssetReq = new CreateAssetRequest("canurtasyrup",onboardLicenseeRequest.facilityName,0);
          let createJBFLicenseAssetReq = new CreateAssetRequest("jbf",onboardLicenseeRequest.facilityName,0);
          let queryGetAccount$ = this.queriesController.getAccount(getAccountReq)
               .then((commandResponse:any) => {
                 if(!!commandResponse.txHash){
                   console.log("queryGetAccount response:::::",commandResponse);
                   return {"queryGetAccount":commandResponse.txHash};
               }
             }).catch((err) => err);
             
              const commandCreateDomain$ = this.commandsController.createDomain(createDomainReq)
                .then((commandResponse:any) => {
                   if(!!commandResponse.txHash){
                     console.log("createDomain response:::::",commandResponse);
                     return {"createDomain":commandResponse.txHash};
                 }
             }).catch((err) => err);
     
              const commandCreateAccount$ = this.commandsController.createAccount(createAccountReq)
               .then((commandResponse:any) => {
                 if(!!commandResponse.txHash){
                   console.log("createAccount response:::::",commandResponse);
                   return {"createAccount":commandResponse.txHash};
                 }
                 else
                 return {"createAccount":commandResponse};
             }).catch((err) => err);
     
             const commandAppendRole$ = this.commandsController.appendRole(appendRoleReq)
               .then((commandResponse:any) => {
                 if(!!commandResponse.txHash){
                   console.log("appendRole response:::::",commandResponse);
                   return {"appendRole":commandResponse.txHash};
               }
               else
               return {"appendRole":commandResponse};
             }).catch((err) => err);
           createCanurtaLicenseAssetReq = new CreateAssetRequest("canurta",onboardLicenseeRequest.facilityName,0);
          createCanurtaSyrupLicenseAssetReq = new CreateAssetRequest("canurtasyrup",onboardLicenseeRequest.facilityName,0);
          createJBFLicenseAssetReq = new CreateAssetRequest("jbf",onboardLicenseeRequest.facilityName,0);

        //Create Domain
        // const queryGetAccount = this.queriesController.getAccount(getAccountReq)
        //    .then((queryResponse:any) => {
        //      console.log("Check for account::",queryResponse);
        //       if (!queryResponse.accountId && queryResponse.error.includes('could find account')){
        //         console.log("Create new domain...this is new account");
        //         // return {"getAccountQuery": "N/A"}
        //         this.commandsController.createDomain(createDomainReq)
        //         .then((commandResponse:any) => {
        //           if(!!commandResponse.txHash){
        //             console.log("createDomainReq response:::::",commandResponse);
        //             // return {"appendRole":commandResponse.txHash};
        //             this.commandsController.createAccount(createAccountReq)
        //             .then((commandResponse:any) => {
        //               if(!!commandResponse.txHash){
        //                 console.log("createAccountReq response:::::",commandResponse);
        //                 // return {"appendRole":commandResponse.txHash};
        //                 this.commandsController.appendRole(appendRoleReq)
        //                 .then((commandResponse:any) => {
        //                   if(!!commandResponse.txHash){
        //                     console.log("appendRoleReq response:::::",commandResponse);
        //                     // return {"appendRole":commandResponse.txHash};
                            
        //                     }
        //                     })
        //                 }
        //                 })
        //             }
        //             })
        //     }
        // }).catch((err) => err);

        // const queryGetAccount = this.queriesController.getAccount(getAccountReq)
        //   .then((commandResponse:any) => {
        //     if(!!commandResponse.txHash){
        //       console.log("queryGetAccount response:::::",commandResponse);
        //       return {"queryGetAccount":commandResponse.txHash};
        //   }
        // }).catch((err) => err);

        // const commandCreateDomain = this.commandsController.createDomain(createDomainReq)
        //    .then((commandResponse:any) => {
        //       if(!!commandResponse.txHash){
        //         console.log("createDomain response:::::",commandResponse);
        //         return {"createDomain":commandResponse.txHash};
        //     }
        // }).catch((err) => err);

        // const commandCreateAccount = this.commandsController.createAccount(createAccountReq)
        //   .then((commandResponse:any) => {
        //     if(!!commandResponse.txHash){
        //       console.log("createAccount response:::::",commandResponse);
        //       return {"createAccount":commandResponse.txHash};
        //     }
        //     else
        //     return {"createAccount":commandResponse};
        // }).catch((err) => err);

        // const commandAppendRole = this.commandsController.appendRole(appendRoleReq)
        //   .then((commandResponse:any) => {
        //     if(!!commandResponse.txHash){
        //       console.log("appendRole response:::::",commandResponse);
        //       return {"appendRole":commandResponse.txHash};
        //   }
        //   else
        //   return {"appendRole":commandResponse};
        // }).catch((err) => err);

        // const commandCreateCanurtaLicense = this.commandsController.createAsset(createCanurtaLicenseAssetReq)
        //   .then((commandResponse:any) => {
        //     if(!!commandResponse.txHash){
        //       console.log("createCanurtaAsset response:::::",commandResponse);
        //       return {"createCanurtaAsset":commandResponse.txHash};
        //   }
        //   else
        //   return {"createCanurtaAsset":commandResponse};
        // }).catch((err) => err);

        // const commandCreateCanurtaSyrupLicense = this.commandsController.createAsset(createCanurtaSyrupLicenseAssetReq)
        //   .then((commandResponse:any) => {
        //     if(!!commandResponse.txHash){
        //       console.log("createCanurtaSyrupAsset response:::::",commandResponse);
        //       return {"createCanurtaSyrupAsset":commandResponse.txHash};
        //   }
        //   else
        //   return {"createCanurtaSyrupAsset":commandResponse};
        // }).catch((err) => err);

        // const commandCreateJBFLicense = this.commandsController.createAsset(createJBFLicenseAssetReq)
        //   .then((commandResponse:any) => {
        //     if(!!commandResponse.txHash){
        //       console.log("createJBFAsset response:::::",commandResponse);
        //       return {"createJBFAsset":commandResponse.txHash};
        //   }
        //   else
        //   return {"createJBFAsset":commandResponse};
        // }).catch((err) => err);

        const createAllLicense = 
        this.commandsController.createAsset(createCanurtaLicenseAssetReq)
        .then((commandResponse:any) => {
            if(!!commandResponse.txHash){
              console.log("createCanurtaAsset response:::::",commandResponse);
              //  return commandResponse
              //  {"createCanurtaAsset":commandResponse.txHash};
              this.commandsController.createAsset(createCanurtaSyrupLicenseAssetReq)
            .then((commandResponse:any) => {
              if(!!commandResponse.txHash){
                console.log("createCanurtaSyrupAsset response:::::",commandResponse);
                // return {"createCanurtaSyrupAsset":commandResponse.txHash};
                // return commandResponse
                this.commandsController.createAsset(createJBFLicenseAssetReq)
            .then((commandResponse:any) => {
              if(!!commandResponse.txHash){
                console.log("createJBFAsset response:::::",commandResponse);
                return {"Asset":commandResponse.txHash};
                // return commandResponse
            }})
            }})
          }
          return commandResponse
        })
        // .then((commandResponse:any) =>{
        //   console.log("createCanurtaAsset222 response:::::",commandResponse);
        //   if(!!commandResponse){
        //     this.commandsController.createAsset(createCanurtaSyrupLicenseAssetReq)
        //     .then((commandResponse:any) => {
        //       if(!!commandResponse.txHash){
        //         // console.log("createCanurtaSyrupAsset response:::::",commandResponse);
        //         // return {"createCanurtaSyrupAsset":commandResponse.txHash};
        //         // return commandResponse
        //     }
        //     return commandResponse
        //   })
        // }
        // })
        // .then((commandResponse:any) => {
        //   console.log("createCanurtaSyrupAsset333 response:::::",commandResponse);
        //   if(!!commandResponse){
        //     this.commandsController.createAsset(createJBFLicenseAssetReq)
        //     .then((commandResponse:any) => {
        //       if(!!commandResponse.txHash){
        //         // console.log("createJBFAsset response:::::",commandResponse);
        //         // return {"createJBFAsset":commandResponse.txHash};
        //         // return commandResponse
        //     }
        //     return commandResponse
        //   })
        //   .then((commandResponse:any) => {
        //     console.log("createCanurtaSyrupAsset444 response:::::",commandResponse);
        //     return {"createAssets":commandResponse}
        //     // commandResponse.txHash
        //   })
        // }
        // })

        Promise.all([
          queryGetAccount$,
          commandCreateDomain$, 
          commandCreateAccount$,
          // commandCreateCanurtaLicense,
          // commandCreateCanurtaSyrupLicense,
          // commandCreateJBFLicense
        ]).then((response1:any)=>{
          // res.send({'AccountCreated::::':response}).status(200);
          Promise.all([
            commandAppendRole$,
            createAllLicense
            // commandCreateCanurtaLicense,
            // commandCreateCanurtaSyrupLicense,
            // commandCreateJBFLicense
          ]).then((response2:any) => {
            res.send({'Accounts Created::::::':response1,'Assets Created::::':response2}).status(200);
          })
          .catch( err => {
            res.send(err).status(500);
          })
        }).catch(err => {
          res.send(err).status(500);
        });


          // this.queriesController.getAccount(getAccountReq)
          //   .then((queryResponse:any) => {
          //     console.log(queryResponse);
          //     if (!queryResponse.accountId && queryResponse.error.includes('could find account')){
          //       this.commandsController.createAccount(createAccountReq)
          //         .then((commandResponse:any) => {
          //             console.log('createAccount response:::::', commandResponse);
          //             if(!!commandResponse.txHash){
          //               console.log(appendRoleReq)
          //               this.commandsController.appendRole(appendRoleReq)
          //                 .then((commandResponse:any) => {
          //                   console.log("appendRole response:::::",commandResponse);
          //                   if(!!commandResponse.txHash) {
          //                   this.commandsController.createAsset(createCanurtaLicenseAssetReq)
          //                     .then((commandResponse:any) => {
          //                       console.log("createCanurtaAsset response:::::",commandResponse);
          //                       if(!!commandResponse.txHash) {
          //                       this.commandsController.createAsset(createCanurtaSyrupLicenseAssetReq)
          //                         .then((commandResponse: any) => {
          //                           console.log("createCanurtaSyrupAsset response:::::",commandResponse);
          //                           if(!!commandResponse.txHash) {
          //                           this.commandsController.createAsset(createJBFLicenseAssetReq)
          //                             .then((commandResponse:any) => {
          //                               console.log("createJBFLicenseAsset response:::::",commandResponse);
          //                               res.send(commandResponse);
          //                             })
          //                           }
          //                         })
          //                       }
          //                     })
          //                   }
          //                 });
          //             } else {
          //               res.status(500).send({'response':'Account Could Not Be Created'});
          //             }
          //           });
          //     }
          //     else{
          //       console.log("client error")
          //       res.status(400).send({'response':'This account already exists.'});
          //     }

          //   });

        });
    }

    private async _processHempCOA() {
      this._router.post('/processHempCOA', (req: Request, res: Response) => {
          let onboardLicenseeRequest;
          onboardLicenseeRequest = req.body;
          console.log("Incoming request for *onboardLicensee* ::: %s",onboardLicenseeRequest);
          let keypair = createKeyPair();
          let createAccountReq = new CreateAccountRequest(onboardLicenseeRequest.facilityName,IROHA_DOMAIN_ID,keypair.publicKey);
          let getAccountReq = new GetAccountRequest(onboardLicenseeRequest.facilityName+IROHA_ACCOUNT_SUFFIX);
          let appendRoleReq = new AppendRoleRequest(onboardLicenseeRequest.facilityName,IROHA_ROLE_LICENSEE);

          this.queriesController.getAccount(getAccountReq)
            .then(queryResponse => {
              console.log(queryResponse);
              if (!queryResponse.accountId && queryResponse.error.includes('could find account')){
                this.commandsController.createAccount(createAccountReq)
                  .then(commandResponse => {
                      console.log('response:::::', commandResponse);
                      if(!!commandResponse.txHash){
                        console.log(appendRoleReq)
                        this.commandsController.appendRole(appendRoleReq)
                          .then(commandResponse => {
                            console.log(commandResponse);
                            res.send(commandResponse);
                          });
                      } else {
                        res.status(500).send({'response':'Account Could Not Be Created'});
                      }
                    });
              }
              else{
                console.log("client error")
                res.status(400).send({'response':'This account already exists.'});
              }

            });

        });
    }


  private async _generateKeyPair() {
    this._router.get('/newKeyPair', (req: Request, res: Response) => {
        console.log("Incoming request for *generateKeyPair* :::");
        res.send(createKeyPair());
      });
  }
}

export = new AdminController().router;