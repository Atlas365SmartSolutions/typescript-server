import * as grpc from 'grpc';
import {
    CommandService_v1Client as CommandService_v1Client
  } from 'iroha-helpers-ts/lib/proto/endpoint_grpc_pb';
import { OnboardFarmerRequest } from '../interfaces/AccountInterfaces';
import { IncomingHttpHeaders } from 'http';
import { IROHA_ADMIN_PRIM_KEY, IROHA_PEER_ADDR, IROHA_ROLE_FARMER, IROHA_ROLE_USER } from '../common/Constants';
import { AppendRoleRequest, CreateAccountRequest, CreateDomainRequest, SetAccountDetailRequest } from '../interfaces/iroha/CommandRequests';
import { BatchBuilder, TxBuilder } from 'iroha-helpers-ts/lib/chain';
import { createKeyPair, escapeJSON } from '../common/Utils';
import _ from 'lodash';

class FarmerService {
    private commandService = new CommandService_v1Client(IROHA_PEER_ADDR,grpc.credentials.createInsecure())

    // COMMANDS
    onboardFarmer(onboardFarmerRequest:OnboardFarmerRequest, headers: IncomingHttpHeaders) {
        let keypair = createKeyPair();
        const accountId = `${onboardFarmerRequest.name}@${onboardFarmerRequest.farmBusinessName}`
        let createDomainReq = new CreateDomainRequest(onboardFarmerRequest.farmBusinessName, IROHA_ROLE_USER);
        let createAccountReq = new CreateAccountRequest(onboardFarmerRequest.name, onboardFarmerRequest.farmBusinessName,keypair.publicKey);
        let appendRoleReq = new AppendRoleRequest(accountId,IROHA_ROLE_FARMER);
        let setAccountDetailsReq = new SetAccountDetailRequest(accountId, escapeJSON(JSON.stringify(onboardFarmerRequest)),'account')

        // CreateDomain Transaction
        const createDomainTx = new TxBuilder()
        .createDomain({domainId: createDomainReq.domainId, defaultRole: createDomainReq.defaultRole})
        .addMeta('admin@atlas', 1)
        .tx;

        // createAccount Transaction
        const createAccountTx = new TxBuilder()
        .createAccount({accountName:createAccountReq.accountName,domainId: createAccountReq.domainId,publicKey: createAccountReq.publicKey})
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


        const batchBuilder = new BatchBuilder([
            createDomainTx,
            createAccountTx,
            appendRoleTx,
            SetAccountDetailTx
          ]);
        
        let batch = batchBuilder.setBatchMeta(0);

        for (let i = 0; i < batch.txs.length; i++) {
          batch = batch.sign([IROHA_ADMIN_PRIM_KEY],i);            
        }
    
        return batch.send(this.commandService, 5000)
          .then(batchBuilderResponse => {
            console.log("BatchBuilder Response",batchBuilderResponse);
            return batchBuilderResponse;
          })
          .catch(err => {
            console.error(err);
            return err.message;
          }); 
    };
}

export = new FarmerService();