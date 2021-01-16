import { Request, Response, Router } from 'express';
import { OnboardLicenseeRequest } from '../interfaces/iroha/AdminRequests';
import { createKeyPair } from '../common/Utils';
import CommandsController from '../controllers/CommandsController';
import QueriesController from '../controllers/QueriesController';
import { AppendRoleRequest, CreateAccountRequest } from '../interfaces/iroha/CommandRequests';
import { GetAccountRequest } from '../interfaces/iroha/QueryRequests';
import { IROHA_ACCOUNT_SUFFIX, IROHA_ADMIN_PRIM_KEY, IROHA_DOMAIN_ID, IROHA_PEER_ADDR, IROHA_ROLE_LICENSEE } from '../common/Constants';
import { TxBuilder,BatchBuilder } from 'iroha-helpers-ts/lib/chain'
import {
  CommandService_v1Client as CommandService,
  QueryService_v1Client as QueryService
} from 'iroha-helpers-ts/lib/proto/endpoint_pb_service'
import { NodeHttpTransport } from '@improbable-eng/grpc-web-node-http-transport';

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
        let onboardLicenseeRequest = new OnboardLicenseeRequest;
        onboardLicenseeRequest = req.body;
        console.log("Incoming request for *onboardLicensee* ::: %s",onboardLicenseeRequest);
        let keypair = createKeyPair();
        let createAccountReq = new CreateAccountRequest(onboardLicenseeRequest.accountId,IROHA_DOMAIN_ID,keypair.publicKey);
        let getAccountReq = new GetAccountRequest(onboardLicenseeRequest.accountId+IROHA_ACCOUNT_SUFFIX);
        let appendRoleReq = new AppendRoleRequest(onboardLicenseeRequest.accountId,IROHA_ROLE_LICENSEE);

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