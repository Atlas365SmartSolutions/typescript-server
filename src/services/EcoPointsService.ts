import * as grpc from 'grpc';
import {
    CommandService_v1Client as CommandService_v1Client
  } from 'iroha-helpers-ts/lib/proto/endpoint_grpc_pb';
import { OnboardEcoPointsMemberRequest } from '../interfaces/AccountInterfaces';
import { IncomingHttpHeaders } from 'http';
import { IROHA_ADMIN_PRIM_KEY, IROHA_PEER_ADDR, COMMITTED, IROHA_PEER_DOCKER_NAME, ECOPOINTS_DOMAIN, ECOPOINTS_ASSET_ID, IROHA_ADMIN_ACCOUNT } from '../common/Constants';
import { SetAccountDetailRequest } from '../interfaces/iroha/CommandRequests';
import { BatchBuilder, TxBuilder } from 'iroha-helpers-ts/lib/chain';
import { createIrohaBatch, createKeyPair, escapeJSONObj } from '../common/Utils';
import _ from 'lodash';
import {exec} from 'child_process';


class EcoPointsService {
    private commandService = new CommandService_v1Client(IROHA_PEER_ADDR,grpc.credentials.createInsecure())

    onboardMember(onboardEcoPointsMemberRequest:OnboardEcoPointsMemberRequest, headers: IncomingHttpHeaders) {
      let keypair = createKeyPair();
      const accountId = `${onboardEcoPointsMemberRequest.consumerId}@${ECOPOINTS_DOMAIN}`;
      const memberProfile = {
            "address": "",
            "city": onboardEcoPointsMemberRequest.city,
            "dob": onboardEcoPointsMemberRequest.dob,
            "email": onboardEcoPointsMemberRequest.email,
            "firstName": onboardEcoPointsMemberRequest.firstname,
            "lastName": onboardEcoPointsMemberRequest.lastname,
            "password": onboardEcoPointsMemberRequest.password
      };
      let setAccountDetailsReq = new SetAccountDetailRequest(accountId, escapeJSONObj(JSON.stringify(onboardEcoPointsMemberRequest)),'account')
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

      // createAccount Transaction
      const createAccountTx = new TxBuilder()
      .createAccount({accountName:onboardEcoPointsMemberRequest.consumerId,domainId: ECOPOINTS_DOMAIN,publicKey: keypair.publicKey})
      .addMeta(IROHA_ADMIN_ACCOUNT, 1)
      .tx;
      
      // addAssetQuantity Transaction
      const AddAssetQuantityTx = new TxBuilder()
      .addAssetQuantity({assetId: ECOPOINTS_ASSET_ID, amount: onboardEcoPointsMemberRequest.ecoPointsValue})
      .addMeta(IROHA_ADMIN_ACCOUNT, 1)
      .tx;

      // setAccountDetail Transaction
      const SetAccountDetailTx = new TxBuilder()
      .setAccountDetail({accountId: setAccountDetailsReq.accountId, key: setAccountDetailsReq.key, value: escapeJSONObj(setAccountDetailsReq.value)})
      .addMeta(IROHA_ADMIN_ACCOUNT, 1)
      .tx;

      // create admin batch transactions
      const adminBatchBuilder = new BatchBuilder([
          createAccountTx,
          AddAssetQuantityTx,
          SetAccountDetailTx
        ]);

      const adminBatch = createIrohaBatch(adminBatchBuilder,IROHA_ADMIN_PRIM_KEY);
  
      return adminBatch.send(this.commandService, 5000)
        .then((adminBatchBuilderResponse:any) => {
          console.log("BatchBuilder Response",adminBatchBuilderResponse);
              return {"adminBatch": adminBatchBuilderResponse.txHash, status: COMMITTED};
            })
            .catch(err => {
              console.error(err);
              return err.message;
          })
    };
}

export = new EcoPointsService();