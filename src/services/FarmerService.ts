import * as grpc from 'grpc';
import {
    CommandService_v1Client as CommandService, CommandService_v1Client
  } from 'iroha-helpers-ts/lib/proto/endpoint_grpc_pb';
import commandsInit from 'iroha-helpers-ts/lib/commands/index';
import { OnboardFarmerRequest } from '../interfaces/AccountInterfaces';
import { IncomingHttpHeaders } from 'http';
import { Router } from 'express';
import { IROHA_ADMIN_PRIM_KEY, IROHA_PEER_ADDR, IROHA_ROLE_FARMER, IROHA_ROLE_USER } from '../common/Constants';
import CommandsController from '../controllers/CommandsController';
import QueriesController from '../controllers/QueriesController';
import { AppendRoleRequest, CreateAccountRequest, CreateDomainRequest, SetAccountDetailRequest } from '../interfaces/iroha/CommandRequests';
import { BatchBuilder, TxBuilder } from 'iroha-helpers-ts/lib/chain';
import { createKeyPair, escapeJSON, returnJSON } from '../common/Utils';

class FarmerService {
    private _router = Router();
    private commandsController = CommandsController;
    private queriesController = QueriesController;
    private commandService = new CommandService_v1Client(IROHA_PEER_ADDR,grpc.credentials.createInsecure())

    // COMMANDS
    onboardFarmer(onboardFarmerRequest:OnboardFarmerRequest, headers: IncomingHttpHeaders) {
        let keypair = createKeyPair();
        const accountId = `${onboardFarmerRequest.name}@${onboardFarmerRequest.farmBusinessName}`
        let createDomainReq = new CreateDomainRequest(onboardFarmerRequest.farmBusinessName, IROHA_ROLE_USER);
        let createAccountReq = new CreateAccountRequest(onboardFarmerRequest.name, onboardFarmerRequest.farmBusinessName,keypair.publicKey);
        let appendRoleReq = new AppendRoleRequest(accountId,IROHA_ROLE_FARMER);
        let setAccountDetailsReq = new SetAccountDetailRequest(accountId, escapeJSON(JSON.stringify(onboardFarmerRequest)),'account')
        // escapeJSON(JSON.stringify((onboardFarmerRequest)))
        // Promise.all([
        //     this.commandsController.createDomain(createDomainReq),
        //     this.commandsController.createAccount(),
        //     this.commandsController.appendRole(),
        //     this.commandsController.setAccountDetail()

        //   ])
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

        console.log(JSON.stringify(onboardFarmerRequest));

        const batchBuilder = new BatchBuilder([
            createDomainTx,
            createAccountTx,
            appendRoleTx,
            SetAccountDetailTx

          ]);
           const batch = batchBuilder
          .setBatchMeta(0);

    
        return batchBuilder
            .setBatchMeta(0)
            .sign([IROHA_ADMIN_PRIM_KEY], 0)
            .sign([IROHA_ADMIN_PRIM_KEY], 1)
            .sign([IROHA_ADMIN_PRIM_KEY], 2)
            .sign([IROHA_ADMIN_PRIM_KEY], 3)
            .send(this.commandService, 5000)
            .then(batchBuilderResponse => {
              console.log("BatchBuilder Response",batchBuilderResponse);
              return batchBuilderResponse;
            })
            .catch(err => {
              console.error(err);
              return err.message;
            });
            
        // return null;
    };

    
}

export = new FarmerService();