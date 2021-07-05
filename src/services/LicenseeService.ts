import * as grpc from 'grpc';
import { IncomingHttpHeaders } from 'http';
import { BatchBuilder, TxBuilder } from 'iroha-helpers-ts/lib/chain';
import { CommandService_v1Client } from "iroha-helpers-ts/lib/proto/endpoint_grpc_pb";
import { Transaction } from 'iroha-helpers-ts/lib/proto/transaction_pb';
import { IROHA_ADMIN_ACCOUNT, IROHA_ADMIN_PRIM_KEY, IROHA_CANURTA_ASSET_NAME, IROHA_CANURTA_SYRUP_ASSET_NAME, IROHA_COMMITTED_STATUS, IROHA_FACILITY_ASSET_PRECISION, IROHA_JBF_ASSET_NAME, IROHA_PEER_ADDR, IROHA_ROLE_LICENSEE, IROHA_ROLE_USER, ONBOARD_LICENSEE_ASSETS_DESC } from "../common/Constants";
import { createIrohaBatch, createKeyPair, escapeJSONObj } from '../common/Utils';
import QueriesController from "../controllers/QueriesController";
import { GetAccountRequest } from '../interfaces/iroha/QueryRequests';

class LicenseeService {
    private commandService = new CommandService_v1Client(IROHA_PEER_ADDR,grpc.credentials.createInsecure())
    private queriesController = QueriesController;

    onboardLicensee(onboardLicenseeRequest:any, headers: IncomingHttpHeaders){
        let keypair = createKeyPair();
        let getAccountReq = new GetAccountRequest(onboardLicenseeRequest.facilityName,onboardLicenseeRequest.facilityName);

        let addAssetQuantityTxs:Transaction[] = [];
        let transferAssetQuantityTxs:Transaction[] = [];

        return this.queriesController.getAccount(getAccountReq)
            .then(accountQuerryResp => {
                if(!!accountQuerryResp.error) {
                    console.log("Account does not exist. Continuing...");
                    // createAccount Transaction
                    const createAccountTx = new TxBuilder()
                        .createAccount({accountName:onboardLicenseeRequest.facilityName,domainId: onboardLicenseeRequest.facilityName,publicKey: keypair.publicKey})
                        .addMeta(IROHA_ADMIN_ACCOUNT, 1)
                        .tx;

                    // createDomain Transaction
                    const createDomainTx = new TxBuilder()
                        .createDomain({domainId:onboardLicenseeRequest.facilityName,defaultRole: IROHA_ROLE_LICENSEE})
                        .addMeta(IROHA_ADMIN_ACCOUNT, 1)
                        .tx;
                    
                    const createAsset1Tx = new TxBuilder()
                        .createAsset({assetName: IROHA_CANURTA_ASSET_NAME, domainId: onboardLicenseeRequest.facilityName, precision: IROHA_FACILITY_ASSET_PRECISION})
                        .addMeta(IROHA_ADMIN_ACCOUNT, 1)
                        .tx;

                    const createAsset2Tx = new TxBuilder()
                        .createAsset({assetName: IROHA_CANURTA_SYRUP_ASSET_NAME, domainId: onboardLicenseeRequest.facilityName, precision: IROHA_FACILITY_ASSET_PRECISION})
                        .addMeta(IROHA_ADMIN_ACCOUNT, 1)
                        .tx;
                    
                    const createAsset3Tx = new TxBuilder()
                        .createAsset({assetName: IROHA_JBF_ASSET_NAME, domainId: onboardLicenseeRequest.facilityName, precision: IROHA_FACILITY_ASSET_PRECISION})
                        .addMeta(IROHA_ADMIN_ACCOUNT, 1)
                        .tx;

                    // addAssetQuantity Transaction

                    onboardLicenseeRequest.licenses.forEach((licenses: any) => {
                        const addAssetQuantityTx = new TxBuilder()
                        .addAssetQuantity({assetId: `${licenses}#${onboardLicenseeRequest.facilityName}`, amount: '1'})
                        .addMeta(IROHA_ADMIN_ACCOUNT, 1)
                        .tx;   

                        const transferAssetTx = new TxBuilder()
                        .transferAsset({
                          amount: '1',
                          assetId: `${licenses}#${onboardLicenseeRequest.facilityName}`,
                          description: ONBOARD_LICENSEE_ASSETS_DESC,
                          destAccountId: `${onboardLicenseeRequest.facilityName}@${onboardLicenseeRequest.facilityName}`,
                          srcAccountId: IROHA_ADMIN_ACCOUNT})
                        .addMeta(IROHA_ADMIN_ACCOUNT, 1)
                        .tx;

                        addAssetQuantityTxs.push(addAssetQuantityTx);
                        transferAssetQuantityTxs.push(transferAssetTx);
                    });

                    // create account batch transactions
                    const accountBatchBuilder = new BatchBuilder([
                        createAccountTx
                    ]);

                    // create domain batch transactions
                    const domainBatchBuilder = new BatchBuilder([
                        createDomainTx
                    ]);
                    
                    // create create asset batch transactions
                    const createAssetBatchBuilder = new BatchBuilder([
                        createAsset1Tx,
                        createAsset2Tx,
                        createAsset3Tx
                    ]);
                    
                    // create add asset quantity batch transactions
                    const addAssetBatchBuilder = new BatchBuilder([
                        ...addAssetQuantityTxs
                    ]);
                    
                    // create transfer asset batch transactions
                    const transferAssetBatchBuilder = new BatchBuilder([
                        ...transferAssetQuantityTxs
                    ]);         

                    const accountBatch = createIrohaBatch(accountBatchBuilder,IROHA_ADMIN_PRIM_KEY);
                    const domainBatch = createIrohaBatch(domainBatchBuilder,IROHA_ADMIN_PRIM_KEY);
                    const createAssetBatch = createIrohaBatch(createAssetBatchBuilder,IROHA_ADMIN_PRIM_KEY);
                    const addAssetBatch = createIrohaBatch(addAssetBatchBuilder,IROHA_ADMIN_PRIM_KEY);
                    const transferAssetBatch = createIrohaBatch(transferAssetBatchBuilder,IROHA_ADMIN_PRIM_KEY);
                    let txHahses:String[] = [];

                    return domainBatch.send(this.commandService, 5000)
                        .then((domainBatchResponse:any) => {
                            console.log("domain batch response",domainBatchResponse);

                            if(!!domainBatchResponse.txHash) {
                                txHahses.push(domainBatchResponse.txHash);

                                return accountBatch.send(this.commandService, 5000)
                                    .then((accountBatchResp:any) => {
                                        console.log("account batch response",accountBatchResp);
                                        if(!!accountBatchResp.txHash) {
                                            txHahses.push(accountBatchResp.txHash);

                                            return createAssetBatch.send(this.commandService, 5000)
                                                .then((createAssetBatchResp:any) => {
                                                    console.log("create asset batch response",createAssetBatchResp);
                                                    if(!!createAssetBatchResp.txHash) {
                                                        txHahses.push(createAssetBatchResp.txHash);

                                                        return addAssetBatch.send(this.commandService, 5000)
                                                            .then((addAssetBatchResp:any) => {
                                                                console.log("add asset batch response",addAssetBatchResp);
                                                                if(!!addAssetBatchResp.txHash) {
                                                                    txHahses.push(addAssetBatchResp.txHash);

                                                                    return transferAssetBatch.send(this.commandService, 5000)
                                                                        .then((transferAssetBatchResp:any) => {
                                                                            console.log("transfer asset batch response",transferAssetBatchResp);
                                                                            if(!!transferAssetBatchResp.txHash) {
                                                                                let detail = {
                                                                                    "onBoardDate": new Date().toString(),
                                                                                    "term": onboardLicenseeRequest.term,
                                                                                    "licenses": onboardLicenseeRequest.licenses.toString(),
                                                                                    "address": onboardLicenseeRequest.facilityAddress,
                                                                                    "onboardConfirmation": {
                                                                                        "account":txHahses[0],
                                                                                        "domain":txHahses[1],
                                                                                        "canurtaLicense":txHahses[2],
                                                                                        "canurtaSyrupLicense": txHahses[2],
                                                                                        "jbfLicense": txHahses[2],
                                                                                        "addLicenseTxs": txHahses[3],
                                                                                        "transferLicenseTxs": txHahses[4]
                                                                                    }
                                                                                };
                                                            
                                                                                // setAccountDetail Transaction
                                                                                const setAccountDetailTx = new TxBuilder()
                                                                                .setAccountDetail({accountId: `${onboardLicenseeRequest.facilityName}@${onboardLicenseeRequest.facilityName}`, key: onboardLicenseeRequest.facilityName, value: escapeJSONObj(detail)})
                                                                                .addMeta(IROHA_ADMIN_ACCOUNT, 1)
                                                                                .tx;

                                                                                // create set account detail batch transactions
                                                                                const setAccountDetailBatchBuilder = new BatchBuilder([
                                                                                    setAccountDetailTx
                                                                                ]);      
                                                                                                                        
                                                                                const setAccountDetailBatch = createIrohaBatch(setAccountDetailBatchBuilder,IROHA_ADMIN_PRIM_KEY);
                                                                                return setAccountDetailBatch.send(this.commandService, 5000)
                                                                                    .then((setAccountDetailResp:any) => {
                                                                                        console.log("set account detail batch response",setAccountDetailResp);
                                                                                        if(!!setAccountDetailResp.txHash){
                                                                                            return {
                                                                                                "account":txHahses[0],
                                                                                                "domain":txHahses[1],
                                                                                                "canurtaLicense":txHahses[2],
                                                                                                "canurtaSyrupLicense": txHahses[2],
                                                                                                "jbfLicense": txHahses[2],
                                                                                                "addLicenseTxs": txHahses[3],
                                                                                                "transferLicenseTxs": txHahses[4],
                                                                                                "status": IROHA_COMMITTED_STATUS,
                                                                                                "txHash": setAccountDetailResp.txHash
                                                                                            };
                                                                                        }
                                                                                    })
                                                                                    .catch((err:any )=> {
                                                                                        console.error(err);
                                                                                        return err.message;
                                                                                    });

                                                                                

                                                                            } else {
                                                                                return {"error": "Could not add assets to account."};
                                                                            }

                                                                        })

                                                                } else {
                                                                    return {"error": "Could not add assets to account."};
                                                                }                                                            
                                                            });


                                                    } else {
                                                        return {"error": "Could not create assets."};
                                                    }
                                                });

                                        } else {
                                            return {"error": "Could not create domain."};
                                        }
                                    });

                            } else {
                                return {"error": "Could not create account."};
                            }
                        })
                        .catch((err:any )=> {
                          console.error(err);
                          return err.message;
                    });

                } else {
                    return {"error":"Account already exists."};
                }
            })
            .catch(err => {
                console.log(err);
                return err;
            });
    }
}

export = new LicenseeService();