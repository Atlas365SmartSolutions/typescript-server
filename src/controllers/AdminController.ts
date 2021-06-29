import { Request, response, Response, Router } from 'express';
import { createKeyPair, escapeJSONObj, LicenseType } from '../common/Utils';
//import CommandsController from '../controllers/CommandsController';
//import QueriesController from '../controllers/QueriesController';
import { AppendRoleRequest, CreateAccountRequest, CreateAssetRequest, CreateDomainRequest, SetAccountDetailRequest, TransferAssetRequest, AdjustAssetQuantityRequest } from '../interfaces/iroha/CommandRequests';
import { GetAccountRequest } from '../interfaces/iroha/QueryRequests';
import { IROHA_ADMIN_ACCOUNT, IROHA_ACCOUNT_SUFFIX, IROHA_ADMIN_PRIM_KEY, IROHA_DOMAIN_ID, IROHA_PEER_ADDR, IROHA_ROLE_LICENSEE, IROHA_ROLE_USER } from '../common/Constants';
import { TxBuilder,BatchBuilder } from 'iroha-helpers-ts/lib/chain'
import {
  CommandService_v1Client as CommandService,
  QueryService_v1Client as QueryService
} from 'iroha-helpers-ts/lib/proto/endpoint_pb_service'
import { NodeHttpTransport } from '@improbable-eng/grpc-web-node-http-transport';
import CommandsController = require('./CommandsController');
import QueriesController = require('./QueriesController');
import { AddAssetQuantity } from '../interfaces/Interfaces';
import grpc from 'grpc';
import { CommandService_v1Client } from 'iroha-helpers-ts/lib/proto/endpoint_grpc_pb';
import { Transaction } from 'iroha-helpers-ts/lib/proto/transaction_pb';

class AdminController {
    private _router = Router();
    private commandsController = CommandsController;
    private queriesController = QueriesController;
    private commandService = new CommandService_v1Client(IROHA_PEER_ADDR,grpc.credentials.createInsecure())



    get router() {
      return this._router;
    }

    constructor(){
        this._onboardLicensee();
        this._processHempCOA();
        this._generateKeyPair();
        this._testBatch();
    }

    // TO DO
    private async _testBatch(){
      this._router.post('/batchOnboardLicensee', (req: Request, res: Response) => {
        let onboardLicenseeRequest = req.body;
        console.log("Incoming request for *onboardLicensee* ::: %s",onboardLicenseeRequest);
        let keypair = createKeyPair();
        let createDomainReq = new CreateDomainRequest(onboardLicenseeRequest.facilityName,IROHA_ROLE_USER);
        let createAccountReq = new CreateAccountRequest(onboardLicenseeRequest.facilityName,onboardLicenseeRequest.facilityName,keypair.publicKey);
        let appendRoleReq = new AppendRoleRequest(onboardLicenseeRequest.facilityName,IROHA_ROLE_LICENSEE);
        let createCanurtaLicenseAssetReq = new CreateAssetRequest("canurta",onboardLicenseeRequest.facilityName,0);
        let createCanurtaSyrupLicenseAssetReq = new CreateAssetRequest("canurtasyrup",onboardLicenseeRequest.facilityName,0);
        let createJBFLicenseAssetReq = new CreateAssetRequest("jbf",onboardLicenseeRequest.facilityName,0);
        let createAssetRequestArray: CreateAssetRequest[] = [];
        let createAssetLicenseRequestArray: CreateAssetRequest[] = [];
        let transferLicenseRequestArray:TransferAssetRequest[] = [];
        // let transferAssetRequestArray:TransferAssetRequest[] = [];
        let assetQuanityRequestArray:AdjustAssetQuantityRequest[] = [];
        let setLicenseePermissionsTx: Transaction[] = [];
        let initializeLicenseeTx: Transaction[] = [];
        let transferLicensesTx: Transaction[] = [];
        onboardLicenseeRequest.licenses.forEach((license: any) => {
          createAssetRequestArray.push(new CreateAssetRequest(license,onboardLicenseeRequest.facilityName,5))
          createAssetLicenseRequestArray.push(new CreateAssetRequest(`${license}-lincense`,onboardLicenseeRequest.facilityName,0))
          assetQuanityRequestArray.push(new AdjustAssetQuantityRequest(`${license}#${onboardLicenseeRequest.facilityName}`,"1"))
          transferLicenseRequestArray.push(new TransferAssetRequest(IROHA_ADMIN_ACCOUNT,
                                                            onboardLicenseeRequest.facilityName,
                                                            `${license}#${onboardLicenseeRequest.facilityName}`,
                                                            IROHA_ROLE_LICENSEE, 
                                                            "1"))
        // transferAssetRequestArray.push(new TransferAssetRequest(IROHA_ADMIN_ACCOUNT,
        //                                                       onboardLicenseeRequest.facilityName,
        //                                                       `${license}#${onboardLicenseeRequest.facilityName}`,
        //                                                       IROHA_ROLE_LICENSEE, 
        //                                                       "1"))
        });

        const createDomainTx = new TxBuilder()
          .createDomain({domainId: createDomainReq.domainId, defaultRole: createDomainReq.defaultRole})
          .addMeta('admin@atlas', 1)
          .tx;

        // initializeLicenseeTx
        createAssetRequestArray.forEach(car => {
          if(initializeLicenseeTx.length === 0) {
            initializeLicenseeTx.push(new TxBuilder()
            .createAccount({accountName: createAccountReq.accountName, domainId: createAccountReq.domainId,publicKey: keypair.publicKey})
            .addMeta('admin@atlas', 1)
            .tx
            )
          }
            initializeLicenseeTx.push(new TxBuilder()
            .createAsset({assetName:car.assetName,domainId:car.domainId,precision:car.precision})
            .createAsset({assetName:`${car.assetName}_license`,domainId:car.domainId,precision:car.precision+5}) 
            .addMeta('admin@atlas', 1)
            .tx
            )
        });

        // setLicenseePermissionsTx
        assetQuanityRequestArray.forEach(aqr => {
          if(setLicenseePermissionsTx.length === 0) {
          setLicenseePermissionsTx.push(new TxBuilder()
          .appendRole({accountId: appendRoleReq.accountId, roleName:appendRoleReq.roleName})
          .addMeta('admin@atlas', 1)
          .tx
          )
        }
          setLicenseePermissionsTx.push(new TxBuilder()
          .addAssetQuantity({assetId: aqr.assetId, amount: aqr.amount})
          .addMeta('admin@atlas', 1)
          .tx
          )

        });
        // transferLicensesTx
        transferLicenseRequestArray.forEach((lra,i,_licenseRequestArray) => {
          let licenseType: string = onboardLicenseeRequest.licenses[i];
          transferLicensesTx.push(new TxBuilder()
            .transferAsset({amount: lra.amount,
              assetId: lra.assetId,
              description: `Transfer of ${licenseType.toUpperCase()} License`,
              destAccountId: lra.destAccountId,
              srcAccountId: lra.srcAccountId})
            .addMeta('admin@atlas', 1)
            .tx
            )
        });
        // transferAssetRequestArray.forEach((lra,i,_licenseRequestArray) => {
        //   let licenseType: string = onboardLicenseeRequest.licenses[i];
        //   transferLicensesTx.push(new TxBuilder()
        //       .transferAsset({amount: lra.amount,
        //         assetId: `${lra.assetId}`,
        //         description: `Transfer of ${licenseType.toUpperCase()} Asset`,
        //         destAccountId: lra.destAccountId,
        //         srcAccountId: lra.srcAccountId})
        //     .addMeta('admin@atlas', 1)
        //     .tx
        //     )
        // });
        

          const onBoard = new BatchBuilder([
            createDomainTx,
            ...initializeLicenseeTx,
            ...setLicenseePermissionsTx,
            ...transferLicensesTx
          ]).setBatchMeta(1)
         
          onBoard.txs.forEach((x,i,a)=>{

            onBoard.sign([IROHA_ADMIN_PRIM_KEY], i)
            .send(this.commandService, 5000)
            .then((onboardLicenseeBatchResp:any) => {
              console.log("onboardLicenseeBatchResp::",onboardLicenseeBatchResp);
  
              let detail = {
                "onBoardDate": new Date().toString(),
                "term": onboardLicenseeRequest.term,
                "licenses": onboardLicenseeRequest.licenses.toString(),
                "address": onboardLicenseeRequest.facilityAddress,
                "onboardConfirmation": {
                  "txId":onboardLicenseeBatchResp.txHash,
                }
              };
              let createAccountDetailReq = new SetAccountDetailRequest(IROHA_ADMIN_ACCOUNT,escapeJSONObj(detail),onboardLicenseeRequest.facilityName);
      
              const finalTx = new TxBuilder()
              .setAccountDetail({accountId: createAccountDetailReq.accountId, key: onboardLicenseeRequest.facilityName, value: escapeJSONObj(detail) })
              .addMeta('admin@atlas', 1)
              .tx
              
              new BatchBuilder([
                finalTx
              ])
                .setBatchMeta(0)
                .sign([IROHA_ADMIN_PRIM_KEY], 0)
                .send(this.commandService, 5000)
                .then(finalBatchResp => {
                  console.log("finalBatch response",finalBatchResp);
                  if(i === a.length-1)
                  res.status(200).send(finalBatchResp);
                })
                .catch(err => {
                  console.error(err);
                  res.status(500).send(err.message);
                });
            }).catch((err:any) => {
              console.log(err);
              res.status(500).send(err.message);
            });
          })
         
      })
    }

    private async _onboardLicensee() {
      this._router.post('/onboardLicensee', async (req: Request, res: Response) => {
          let onboardLicenseeRequest = req.body;
          console.log("Incoming request for *onboardLicensee* ::: %s",onboardLicenseeRequest);
          let keypair = createKeyPair();
          let createDomainReq = new CreateDomainRequest(onboardLicenseeRequest.facilityName,IROHA_ROLE_USER);
          let createAccountReq = new CreateAccountRequest(onboardLicenseeRequest.facilityName,onboardLicenseeRequest.facilityName,keypair.publicKey);
          let getAccountReq = new GetAccountRequest(onboardLicenseeRequest.facilityName,onboardLicenseeRequest.facilityName);
          let appendRoleReq = new AppendRoleRequest(onboardLicenseeRequest.facilityName,IROHA_ROLE_LICENSEE);
          let createCanurtaLicenseAssetReq = new CreateAssetRequest("canurta",onboardLicenseeRequest.facilityName,0);
          let createCanurtaSyrupLicenseAssetReq = new CreateAssetRequest("canurtasyrup",onboardLicenseeRequest.facilityName,0);
          let createJBFLicenseAssetReq = new CreateAssetRequest("jbf",onboardLicenseeRequest.facilityName,0);
          let licenseRequestArray:TransferAssetRequest[] = [];
          let assetQuanityRequestArray:AdjustAssetQuantityRequest[] = [];
          onboardLicenseeRequest.licenses.forEach((licenses: any) => {
            assetQuanityRequestArray.push(new AdjustAssetQuantityRequest(`${licenses}#${onboardLicenseeRequest.facilityName}`,"1"))
            licenseRequestArray.push(new TransferAssetRequest(IROHA_ADMIN_ACCOUNT,
                                                              onboardLicenseeRequest.facilityName,
                                                              `${licenses}#${onboardLicenseeRequest.facilityName}`,
                                                              IROHA_ROLE_LICENSEE, 
                                                              "1"))
          });

          Promise.all([
            this.queriesController.getAccount(getAccountReq),
            this.commandsController.createDomain(createDomainReq)
          ]).then(firstCmdsResp => {
            console.debug('firstCmdsResp:::',firstCmdsResp)
            // Check if account already exist
            if(!!firstCmdsResp[0].error && !firstCmdsResp[1].error) {
               // Check if domain was created
              if (!!firstCmdsResp[1].txHash){
                this.commandsController.createAccount(createAccountReq)
                  .then(accountResp => {
                    if (!!accountResp.txHash){
                      Promise.all([
                          this.commandsController.appendRole(appendRoleReq),
                          this.commandsController.createAsset(createCanurtaLicenseAssetReq),
                          this.commandsController.createAsset(createCanurtaSyrupLicenseAssetReq),
                          this.commandsController.createAsset(createJBFLicenseAssetReq)
                        ]).then(secondCmdsResp => {
                          if(!!secondCmdsResp[0].txHash && !!secondCmdsResp[1].txHash && !!secondCmdsResp[2].txHash && !!secondCmdsResp[3].txHash){
                            Promise.all([
                              this.commandsController.addAssetQuantity(assetQuanityRequestArray[0]),
                              this.commandsController.addAssetQuantity(assetQuanityRequestArray[1]),
                              this.commandsController.addAssetQuantity(assetQuanityRequestArray[2])
                            ]).then((assetQuantityResp) => {
                              console.log("assetQuantityResp::::",assetQuantityResp);
                              if(!!assetQuantityResp[0].txHash && !!assetQuantityResp[1].txHash && !!assetQuantityResp[2].txHash){
                                Promise.all([
                                    this.commandsController.transferAsset(licenseRequestArray[0]),
                                    this.commandsController.transferAsset(licenseRequestArray[1]),
                                    this.commandsController.transferAsset(licenseRequestArray[2])
                                ]).then(transferAssetResp => {
                                  console.log("transferAssetResp::::",transferAssetResp);
                                  if(!!transferAssetResp[0].txHash && !!transferAssetResp[1].txHash && !!transferAssetResp[2].txHash){
                                      //update asset amount depending on which licenses they onboarded with
                                      console.log("1st response",firstCmdsResp);
                                      console.log("2nd response",secondCmdsResp);
                                      let detail = {
                                        "onBoardDate": new Date().toString(),
                                        "term": onboardLicenseeRequest.term,
                                        "licenses": onboardLicenseeRequest.licenses.toString(),
                                        "address": onboardLicenseeRequest.facilityAddress,
                                        "onboardConfirmation": {
                                          "domain":firstCmdsResp[1],
                                          "account":accountResp,
                                          "canurtaLicense":secondCmdsResp[1],
                                          "canurtaSyrupLicense": secondCmdsResp[2],
                                          "jbfLicense": secondCmdsResp[3],
                                          "addLicenseTxs": assetQuantityResp,
                                          "transferLicenseTxs": transferAssetResp
                                        }
                                      };
                                      let createAccountDetailReq = new SetAccountDetailRequest(IROHA_ADMIN_ACCOUNT,escapeJSONObj(detail),onboardLicenseeRequest.facilityName);
                            
                                      this.commandsController.setAccountDetail(createAccountDetailReq).then(setAccountDetailResp => {
                                        console.log(setAccountDetailResp);
                                        if(!!setAccountDetailResp.txHash)
                                        {
                                          res.send({
                                            "domain":firstCmdsResp[1],
                                            "account":accountResp,
                                            "canurtaLicense":secondCmdsResp[1],
                                            "canurtaSyrupLicense": secondCmdsResp[2],
                                            "jbfLicense": secondCmdsResp[3],
                                            "licenseCreationTxs": assetQuantityResp,
                                            "licenseTransferTxs": transferAssetResp
                                          }).status(200);
                                        }
                                        else{
                                          res.status(400).send("Could not Set Account detail");
                                        }
              
                                      })

                                  }
                                })

                              }

                            })

                          }

                      }).catch(err => {
                        console.log(err);
                        res.status(500).send(err);
                      });
                    } else {
                      res.status(500).send(accountResp);
                    }
                })
              }
            } else {
              // need to handle errors for failed domain and failed account creation
              console.log("Account/Domain already exists",firstCmdsResp);
              res.send({"status":"Account/Domain already exists"}).status(400);
            }
          });
        });
    }

    private async _processHempCOA() {
      // this._router.post('/processHempCOA', (req: Request, res: Response) => {
      //     let onboardLicenseeRequest;
      //     onboardLicenseeRequest = req.body;
      //     console.log("Incoming request for *onboardLicensee* ::: %s",onboardLicenseeRequest);
      //     let keypair = createKeyPair();
      //     let createAccountReq = new CreateAccountRequest(onboardLicenseeRequest.facilityName,IROHA_DOMAIN_ID,keypair.publicKey);
      //     let getAccountReq = new GetAccountRequest(onboardLicenseeRequest.facilityName,onboardLicenseeRequest.facilityName);
      //     let appendRoleReq = new AppendRoleRequest(onboardLicenseeRequest.facilityName,IROHA_ROLE_LICENSEE);

      //     this.queriesController.getAccount(getAccountReq)
      //       .then(queryResponse => {
      //         console.log(queryResponse);
      //         if (!queryResponse.accountId && queryResponse.error.includes('could find account')){
      //           this.commandsController.createAccount(createAccountReq)
      //             .then(commandResponse => {
      //                 console.log('response:::::', commandResponse);
      //                 if(!!commandResponse.txHash){
      //                   console.log(appendRoleReq)
      //                   this.commandsController.appendRole(appendRoleReq)
      //                     .then(commandResponse => {
      //                       console.log(commandResponse);
      //                       res.send(commandResponse);
      //                     });
      //                 } else {
      //                   res.status(500).send({'response':'Account Could Not Be Created'});
      //                 }
      //               });
      //         }
      //         else{
      //           console.log("client error")
      //           res.status(400).send({'response':'This account already exists.'});
      //         }

      //       });

      //   });
    }


  private async _generateKeyPair() {
    this._router.get('/newKeyPair', (req: Request, res: Response) => {
        console.log("Incoming request for *generateKeyPair* :::");
        res.send(createKeyPair());
      });
  }
}

export = new AdminController().router;