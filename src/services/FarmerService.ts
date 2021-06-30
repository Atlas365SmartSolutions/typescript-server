import * as grpc from 'grpc';
import {
    CommandService_v1Client as CommandService_v1Client
  } from 'iroha-helpers-ts/lib/proto/endpoint_grpc_pb';
import { Field, InitalizeFieldRequest, OnboardFarmerRequest } from '../interfaces/AccountInterfaces';
import { IncomingHttpHeaders } from 'http';
import { IROHA_ADMIN_PRIM_KEY, IROHA_PEER_ADDR, IROHA_ROLE_FARMER, IROHA_ROLE_USER, COMMITTED, IROHA_ACCOUNT_ID_HEADER, DEFAULT_PAGE_SIZE, IROHA_PEER_DOCKER_NAME } from '../common/Constants';
import { AdjustAssetQuantityRequest, AppendRoleRequest, CompareAndSetAccountDetailRequest, CreateAccountRequest, CreateAssetRequest, CreateDomainRequest, SetAccountDetailRequest } from '../interfaces/iroha/CommandRequests';
import { BatchBuilder, TxBuilder } from 'iroha-helpers-ts/lib/chain';
import { createIrohaBatch, createKeyPair, escapeJSONObj, returnJSON } from '../common/Utils';
import _ from 'lodash';
import {exec} from 'child_process';
import { response } from 'express';
import { Transaction } from 'iroha-helpers-ts/lib/proto/transaction_pb';
import QueriesController from '../controllers/QueriesController';
import { GetAccountDetailRequest } from '../interfaces/iroha/QueryRequests';

class FarmerService {
    private commandService = new CommandService_v1Client(IROHA_PEER_ADDR,grpc.credentials.createInsecure())
    private queriesController = QueriesController;

    // COMMANDS
    adminOnboardFarmer(onboardFarmerRequest:OnboardFarmerRequest, headers: IncomingHttpHeaders) {
      let keypair = createKeyPair();
      const accountId = `${onboardFarmerRequest.farm.farmerName}@${onboardFarmerRequest.farm.farmBusinessName}`;
      let createDomainReq = new CreateDomainRequest(onboardFarmerRequest.farm.farmBusinessName, IROHA_ROLE_FARMER);
      let createFarmerAccountReq = new CreateAccountRequest(onboardFarmerRequest.farm.farmerName, onboardFarmerRequest.farm.farmBusinessName,keypair.publicKey);
      let createAssetReq = new CreateAssetRequest("fields",onboardFarmerRequest.farm.farmBusinessName,0);
      let addAssetQuantityReq = new AdjustAssetQuantityRequest(`fields#${onboardFarmerRequest.farm.farmBusinessName}`,onboardFarmerRequest.numberOfFields.toString());
      let setAccountDetailsReq = new SetAccountDetailRequest(accountId, escapeJSONObj(JSON.stringify(onboardFarmerRequest)),'account')
      let loadPrivCommand = `docker exec ${IROHA_PEER_DOCKER_NAME} bash -c "echo ${keypair.privateKey} >> ${accountId}.priv"`;
      let loadPubCommand = `docker exec ${IROHA_PEER_DOCKER_NAME} bash -c "echo ${keypair.publicKey} >> ${accountId}.pub"`;

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
      

      // appendRole Transaction
      const SetAccountDetailTx = new TxBuilder()
      .setAccountDetail({accountId: setAccountDetailsReq.accountId, key: setAccountDetailsReq.key, value: escapeJSONObj(setAccountDetailsReq.value)})
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

    onboardFarmer(onboardFarmerRequest:OnboardFarmerRequest, headers: IncomingHttpHeaders) {
        let keypair = createKeyPair();
        const accountId = `${onboardFarmerRequest.farm.farmerName}@${onboardFarmerRequest.farm.farmBusinessName}`
        let createDomainReq = new CreateDomainRequest(onboardFarmerRequest.farm.farmBusinessName, IROHA_ROLE_USER);
        let createFarmerAccountReq = new CreateAccountRequest(onboardFarmerRequest.farm.farmerName, onboardFarmerRequest.farm.farmBusinessName,keypair.publicKey);
        let appendRoleReq = new AppendRoleRequest(accountId,"farmer2");
        let createAssetReq = new CreateAssetRequest("fields",onboardFarmerRequest.farm.farmBusinessName,0);
        let addAssetQuantityReq = new AdjustAssetQuantityRequest(`fields#${onboardFarmerRequest.farm.farmBusinessName}`,onboardFarmerRequest.numberOfFields.toString());
        let setAccountDetailsReq = new SetAccountDetailRequest(accountId, escapeJSONObj(JSON.stringify(onboardFarmerRequest)),'account')
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
        .setAccountDetail({accountId: setAccountDetailsReq.accountId, key: setAccountDetailsReq.key, value: escapeJSONObj(setAccountDetailsReq.value)})
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
              let fieldAccountTxList: Transaction[] = [];
      
              initilizeFieldsRequest.fields.forEach((field,i,_) =>{

                let accountId = `${field.fieldId}@${initilizeFieldsRequest.farm.farmBusinessName}`
                let farmerAccountId = `${initilizeFieldsRequest.farm.farmerName}@${initilizeFieldsRequest.farm.farmBusinessName}`
                let setAccountDetailsReq = new SetAccountDetailRequest(accountId, escapeJSONObj(field),'account')
                console.log(escapeJSONObj(field));
                fieldAccountTxList.push(
                  new TxBuilder()
                  .createAccount({accountName:`${field.fieldId}`,domainId: createFieldAccountReq.domainId,publicKey: createFieldAccountReq.publicKey})
                  .addMeta(farmerAccountId, 1)
                  .tx
                );
                fieldAccountTxList.push(new TxBuilder()
                .setAccountDetail({accountId: accountId, key: setAccountDetailsReq.key, value: escapeJSONObj(setAccountDetailsReq.value)})
                .addMeta(farmerAccountId, 1)
                .tx)
              });

              //create field batch transactions
        const fieldBatchBuilder = new BatchBuilder([
          ...fieldAccountTxList
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

      let setFieldAccountDetailReq = new SetAccountDetailRequest(updateFieldRequest.fields[0], 'account', updateFieldRequest.fields[0]);
      let accountId = `${updateFieldRequest.fields[0].fieldId}@${updateFieldRequest.farm.farmBusinessName}`;
      let farmerAccountId = `${updateFieldRequest.farm.farmerName}@${updateFieldRequest.farm.farmBusinessName}`

      let updateFieldTx = new TxBuilder()
      .setAccountDetail({accountId: accountId,key: 'account' ,value: escapeJSONObj(updateFieldRequest.fields[0])})
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

    createProductFromField(createProductFromFieldRequest:any, txCreatorAccount:any){
      let txList:Transaction[] = new Array<Transaction>();

      let getAccountDetailReq = {
        accountId: `${createProductFromFieldRequest.fieldId}@${createProductFromFieldRequest.farm.farmBusinessName}`,
        paginationWriter: txCreatorAccount.irohaAccountId,
        writer: txCreatorAccount.irohaAccountId,
        pageSize: DEFAULT_PAGE_SIZE,
        key: 'account',
        paginationKey: 'account'
      };

      return this.queriesController.getAccountDetail(getAccountDetailReq)
        .then(accountResp => {
          console.log("Response from account query :: %s",returnJSON(accountResp[txCreatorAccount.irohaAccountId]['account']));
          let fieldAccount = accountResp[txCreatorAccount.irohaAccountId];
          let fieldDetails = JSON.parse(returnJSON(fieldAccount.account));
          let fieldHarvestWeight = fieldDetails.weight;
          let numberOfHempAssetsToCreate = Math.floor(fieldHarvestWeight/10); //the bales are 10kg each
          fieldDetails.cropStatus = 'WHOLESALE';

          let farmerAccountId = `${createProductFromFieldRequest.farm.farmerName}@${createProductFromFieldRequest.farm.farmBusinessName}`;

          for (let i = 0; i < numberOfHempAssetsToCreate; i++) {
            let hempAssetName = fieldDetails.fieldId + 'hemp' + i;
            let hempAssetId = hempAssetName +'#'+ createProductFromFieldRequest.farm.farmBusinessName;

            let createHempAssetTx = new TxBuilder()
              .createAsset({
                assetName: hempAssetName, 
                domainId: createProductFromFieldRequest.farm.farmBusinessName, 
                precision: 0})
              .addMeta(farmerAccountId, 1)
              .tx;

            let addHempAssetQuantityTx = new TxBuilder()
              .addAssetQuantity({
                assetId: hempAssetId,
                amount:'10'})
              .addMeta(farmerAccountId, 1)
              .tx;
            
              txList.push(createHempAssetTx);
              txList.push(addHempAssetQuantityTx);
              fieldDetails.hempProductId.push(hempAssetId);
          }

          let updateAccountDetailTx = new TxBuilder()
            .setAccountDetail({accountId: `${createProductFromFieldRequest.fieldId}@${createProductFromFieldRequest.farm.farmBusinessName}`, key: 'account', value: escapeJSONObj(fieldDetails)})
            .addMeta(farmerAccountId, 1)
            .tx;

          txList.push(updateAccountDetailTx);

          //create batch transactions
          const batchBuilder = new BatchBuilder(txList);
          const txBatch = createIrohaBatch(batchBuilder, txCreatorAccount.irohaAccountKey);

          return txBatch.send(this.commandService, 5000)
            .then((fieldBatchBuilderResponse:any) => {
              console.log("BatchBuilder Response",fieldBatchBuilderResponse);
              return  fieldBatchBuilderResponse;
            })
            .catch(err => {
              console.error(err);
              return err.message;
            }); 
        })
        .catch(err => {
          console.log(err);
          return err.message;
        }); 
    }
}

export = new FarmerService();