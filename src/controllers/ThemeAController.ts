import grpc from 'grpc';
import {
    QueryService_v1Client as QueryService,
    CommandService_v1Client as CommandService
  } from 'iroha-helpers/lib/proto/endpoint_grpc_pb';
  import commandsInit from 'iroha-helpers/lib/commands/index';
import queriesInit from 'iroha-helpers/lib/queries/index';
import { ExtractionBatch } from '../../src/interfaces/BatchExtractionInterfaces';
import { escapeJSON, returnJSON } from '../utils/utils'
import { BehaviorSubject, Observable, of } from 'rxjs'

class ThemeAController {
    getAccountDetail$ = new BehaviorSubject<any>(null);
    getAccount$ = new BehaviorSubject<any>(null);
    setAccountDetail$ = new BehaviorSubject<any>(null);
    setAccount$ = new BehaviorSubject<any>(null);
    private IROHA_ADDRESS = 'localhost:50051';
    private adminAccount = 'admin@test';
    private commandService = new CommandService(this.IROHA_ADDRESS,grpc.credentials.createInsecure());
    private queryService = new QueryService(this.IROHA_ADDRESS, grpc.credentials.createInsecure());
    private adminPriv = 'f101537e319568c765b2cc89698325604991dca57b9716b58016b253506cab70';
    private commands = commandsInit;
    private queries = queriesInit;
    
    private COMMAND_OPTIONS = {
        privateKeys: [this.adminPriv],
        creatorAccountId: this.adminAccount,
        quorum: 1,
        commandService: this.commandService,
        timeoutLimit: 1000000,
    };

    private QUERY_OPTIONS = {
        privateKey: this.adminPriv,
        creatorAccountId: this.adminAccount,
        queryService: this.queryService,
        timeoutLimit: 5000,
    };

    // private accountKey = 'admin@test';
    // private batchKeySearch = 'batch_0013_TEST';
    // private respBatchSearchKey = 'batch_0001';
     // DONE
    getAccountDetail(account: any, key: any) {
        this.queries.getAccountDetail(this.QUERY_OPTIONS, {
          accountId: account,
          key: key,
          pageSize: 100,
          paginationKey: key,
          paginationWriter: account,
          writer: account,
        }).then((resp) => {
            this.getAccountDetail$.next({response:returnJSON(resp), error: null});
        })
        .catch((err) => {
          this.getAccountDetail$.next({response:null, error: err.message});
        });
        // return this.getAccountDetail$;
       
    }
    // TO DO - CHECK IF IT WORKS
    getAccount(account: any) {
        this.queries.getAccount(this.QUERY_OPTIONS, {
          accountId: account
        }).then((resp: any) => {
            // var response: any = resp;
            this.getAccount$.next({response:returnJSON(resp.jsonData), error: null});
        })
        .catch((err) => {
          this.getAccount$.next({response:null, error: err.message});
        });
        // return this.getAccountDetail$;
       
    }
    // TO DO INTERFACE FOR SET ACCOUNT DETAILS
    setAccountDetail(accountId: any, req: any){
       this.commands.setAccountDetail(this.COMMAND_OPTIONS,{
            accountId: accountId,
            key: req.batchRequest.batchId,
            value: escapeJSON(req)
          })
        .then((resp: any) => {
             this.setAccountDetail$.next({response:returnJSON(resp), error: null});
        })
        .catch((err) => {
            this.setAccountDetail$.next({response: null, error: err.message});
          });
    }
    // TO DO INTERFACE FOR SET ACCOUNT
    setAccount(accountId: any, req: any){
      this.commands.setAccountDetail(this.COMMAND_OPTIONS,{
           accountId: accountId,
           key: req.batchRequest.batchId,
           value: escapeJSON(req)
         })
       .then((resp: any) => {
            this.setAccountDetail$.next({response:returnJSON(resp), error: null});
       })
       .catch((err) => {
           this.setAccountDetail$.next({response: null, error: err.message});
         });
   }
  }
  
  export = new ThemeAController();