import * as grpc from 'grpc';
import {
    CommandService_v1Client as CommandService_v1Client
  } from 'iroha-helpers-ts/lib/proto/endpoint_grpc_pb';
import { Field, InitalizeFieldRequest, OnboardFarmerRequest } from '../interfaces/AccountInterfaces';
import { IncomingHttpHeaders } from 'http';
import { IROHA_ADMIN_PRIM_KEY, IROHA_PEER_ADDR, IROHA_ROLE_FARMER, IROHA_ROLE_USER, COMMITTED, IROHA_ACCOUNT_ID_HEADER } from '../common/Constants';
import { AdjustAssetQuantityRequest, AppendRoleRequest, CompareAndSetAccountDetailRequest, CreateAccountRequest, CreateAssetRequest, CreateDomainRequest, SetAccountDetailRequest } from '../interfaces/iroha/CommandRequests';
import { BatchBuilder, TxBuilder } from 'iroha-helpers-ts/lib/chain';
import { createIrohaBatch, createKeyPair, escapeJSON } from '../common/Utils';
import _ from 'lodash';
import {exec} from 'child_process';
import { response } from 'express';
import { Transaction } from 'iroha-helpers-ts/lib/proto/transaction_pb';

class FarmerService {
    private commandService = new CommandService_v1Client(IROHA_PEER_ADDR,grpc.credentials.createInsecure())

    // COMMANDS
    onboardFarmer(onboardFarmerRequest:OnboardFarmerRequest, headers: IncomingHttpHeaders) {
        let keypair = createKeyPair();
        const accountId = `${onboardFarmerRequest.farm.farmerName}@${onboardFarmerRequest.farm.farmBusinessName}`
        let createDomainReq = new CreateDomainRequest(onboardFarmerRequest.farm.farmBusinessName, IROHA_ROLE_USER);
        let createFarmerAccountReq = new CreateAccountRequest(onboardFarmerRequest.farm.farmerName, onboardFarmerRequest.farm.farmBusinessName,keypair.publicKey);
        let appendRoleReq = new AppendRoleRequest(accountId,"farmer2");
        let createAssetReq = new CreateAssetRequest("fields",onboardFarmerRequest.farm.farmBusinessName,0);
        let addAssetQuantityReq = new AdjustAssetQuantityRequest(`fields#${onboardFarmerRequest.farm.farmBusinessName}`,onboardFarmerRequest.numberOfFields.toString());
        let setAccountDetailsReq = new SetAccountDetailRequest(accountId, escapeJSON(JSON.stringify(onboardFarmerRequest)),'account')
        let loadPrivCommand = `docker exec iroha1 bash -c "echo ${keypair.privateKey} >> ${accountId}.priv"`;
        let loadPubCommand = `docker exec iroha1 bash -c "echo ${keypair.publicKey} >> ${accountId}.pub"`;

        // Create pub and priv keys in docker container
        exec(`${loadPrivCommand} ; ${loadPubCommand} ; echo success`, (err, stdout, stderr) => {
          if(!!err || !!stderr){
            const error = err? err: stderr
            console.log("errorr:::",error);
          } else {
            console.log("stdoutttt",stdout);

          }
        });

        // ON-BOARD FARMER COMMANDS

        // CreateDomain Transaction
        const createDomainTx = new TxBuilder()
        .createDomain({domainId: createDomainReq.domainId, defaultRole: createDomainReq.defaultRole})
        .addMeta('admin@atlas', 1)
        .tx;

        // createAccount Transaction
        const createAccountTx = new TxBuilder()
        .createAccount({accountName:createFarmerAccountReq.accountName,domainId: createFarmerAccountReq.domainId,publicKey: createFarmerAccountReq.publicKey})
        .addMeta('admin@atlas', 1)
        .tx;

        // appendRoleTx Transaction
        const appendRoleTx = new TxBuilder()
        .appendRole({accountId:appendRoleReq.accountId,roleName:appendRoleReq.roleName})
        .addMeta('admin@atlas', 1)
        .tx;
        

        // appendRole Transaction
        const SetAccountDetailTx = new TxBuilder()
        .setAccountDetail({accountId: setAccountDetailsReq.accountId, key: setAccountDetailsReq.key, value: escapeJSON(setAccountDetailsReq.value)})
        .addMeta('admin@atlas', 1)
        .tx;

        // createAsset Transaction
        const CreateAssetTx = new TxBuilder()
        .createAsset({assetName: createAssetReq.assetName, domainId: createAssetReq.domainId, precision: createAssetReq.precision})
        .addMeta(`${onboardFarmerRequest.farm.farmerName}@${onboardFarmerRequest.farm.farmBusinessName}`, 1)
        .tx;

        // addAssetQuantity Transaction
        const AddAssetQuantityTx = new TxBuilder()
        .addAssetQuantity({assetId: addAssetQuantityReq.assetId, amount: addAssetQuantityReq.amount})
        .addMeta(`${onboardFarmerRequest.farm.farmerName}@${onboardFarmerRequest.farm.farmBusinessName}`, 1)
        .tx;

        // create admin batch transactions
        const adminBatchBuilder = new BatchBuilder([
            createDomainTx,
            createAccountTx,
            appendRoleTx,
            SetAccountDetailTx,
          ]);

          //create farmer batch transactions
        const farmerBatchBuilder = new BatchBuilder([
          CreateAssetTx,
          AddAssetQuantityTx
        ]);

        const adminBatch = createIrohaBatch(adminBatchBuilder,IROHA_ADMIN_PRIM_KEY);
        const farmerBatch = createIrohaBatch(farmerBatchBuilder,keypair.privateKey);
    
        return adminBatch.send(this.commandService, 5000)
          .then((adminBatchBuilderResponse:any) => {
            console.log("BatchBuilder Response",adminBatchBuilderResponse);
            return farmerBatch.send(this.commandService,5000)
              .then((farmerBatchBuilderResponse: any) => {
                console.log(farmerBatchBuilderResponse);
                return {"adminBatch": adminBatchBuilderResponse.txHash, "farmerBatch": farmerBatchBuilderResponse.txHash, status: COMMITTED};
              })
              .catch(err => {
                console.error(err);
                return err.message;
            })
          })
          .catch(err => {
            console.error(err);
            return err.message;
          }); 
    };

    initializeFields(initilizeFieldsRequest:InitalizeFieldRequest, txCreatorAccount: any) {   
      let keypair = createKeyPair();
      let createFieldAccountReq = new CreateAccountRequest(initilizeFieldsRequest.farm.farmerName, initilizeFieldsRequest.farm.farmBusinessName,keypair.publicKey);

              // INITIALIZE FIELDS COMMANDS
              let fieldAccounttxList: Transaction[] = [];
      
              initilizeFieldsRequest.fields.forEach((field,i,_) =>{

                let accountId = `${field.fieldId}@${initilizeFieldsRequest.farm.farmBusinessName}`
                let farmerAccountId = `${initilizeFieldsRequest.farm.farmerName}@${initilizeFieldsRequest.farm.farmBusinessName}`
                let setAccountDetailsReq = new SetAccountDetailRequest(accountId, escapeJSON(JSON.stringify(field)),'account')
                fieldAccounttxList.push(
                  new TxBuilder()
                  .createAccount({accountName:`${field.fieldId}`,domainId: createFieldAccountReq.domainId,publicKey: createFieldAccountReq.publicKey})
                  .addMeta(farmerAccountId, 1)
                  .tx
                );
                fieldAccounttxList.push(new TxBuilder()
                .setAccountDetail({accountId: accountId, key: setAccountDetailsReq.key, value: escapeJSON(setAccountDetailsReq.value)})
                .addMeta(farmerAccountId, 1)
                .tx)
              });

              //create field batch transactions
        const fieldBatchBuilder = new BatchBuilder([
          ...fieldAccounttxList
        ]);
        const fieldBatch = createIrohaBatch(fieldBatchBuilder,txCreatorAccount.irohaAccountKey);

        return fieldBatch.send(this.commandService, 5000)
        .then((fieldBatchBuilderResponse:any) => {
          console.log("BatchBuilder Response",fieldBatchBuilderResponse);
          return  fieldBatchBuilderResponse;
        })
        .catch(err => {
          console.error(err);
          return err.message;
        }); 
    }

    updateField(updateFieldRequest:any, txCreatorAccount: any) {   

      let setFieldAccountDetailReq = new SetAccountDetailRequest(updateFieldRequest.fieldId, 'account', updateFieldRequest.field);
      let accountId = `${updateFieldRequest.field.fieldId}@${updateFieldRequest.farm.farmBusinessName}`;
      let farmerAccountId = `${updateFieldRequest.farm.farmerName}@${updateFieldRequest.farm.farmBusinessName}`

      let updateFieldTx = new TxBuilder()
      .setAccountDetail({accountId: accountId,key: updateFieldRequest.farm.farmBusinessName ,value: escapeJSON(updateFieldRequest.field)})
      .addMeta(farmerAccountId, 1)
      .tx
      
      //create field batch transactions
      const fieldBatchBuilder = new BatchBuilder([
        updateFieldTx
      ]);
      const fieldBatch = createIrohaBatch(fieldBatchBuilder,txCreatorAccount.irohaAccountKey);

      return fieldBatch.send(this.commandService, 5000)
      .then((fieldBatchBuilderResponse:any) => {
        console.log("BatchBuilder Response",fieldBatchBuilderResponse);
        return  fieldBatchBuilderResponse;
      })
      .catch(err => {
        console.error(err);
        return err.message;
      }); 
    }
}

export = new FarmerService();