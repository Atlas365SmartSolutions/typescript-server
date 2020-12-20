import grpc from 'grpc';
import {
    QueryService_v1Client as QueryService,
    CommandService_v1Client as CommandService
  } from 'iroha-helpers/lib/proto/endpoint_grpc_pb';
  import commandsInit from 'iroha-helpers/lib/commands/index';
import queriesInit from 'iroha-helpers/lib/queries/index';
import { ExtractionBatch } from '../../src/interfaces/BatchExtractionInterfaces';
import { escapeJSON } from '../utils/utils'

class ThemeAController {
    private getAccountDetail$: any;
    private setAccountDetail$: any;
    private extractionBatch$: any;
    private IROHA_ADDRESS = 'localhost:50051';
    private adminAccount = 'admin@test';
    private commandService = new CommandService(this.IROHA_ADDRESS,grpc.credentials.createInsecure());
    private queryService = new QueryService(this.IROHA_ADDRESS, grpc.credentials.createInsecure());
    private adminPriv = 'f101537e319568c765b2cc89698325604991dca57b9716b58016b253506cab70';
    private commands = commandsInit;
    private queries = queriesInit;
    
    private COMMAND_OPTIONS = {
        privateKeys: [this.adminPriv],
        creatorAccountId: 'admin@test',
        quorum: 1,
        commandService: this.commandService,
        timeoutLimit: 1000000,
    };

    private QUERY_OPTIONS = {
        privateKey: this.adminPriv,
        creatorAccountId: 'admin@test',
        queryService: this.queryService,
        timeoutLimit: 5000,
    };

    private accountKey = 'admin@test';
    private batchKeySearch = 'batch_001';
    private respBatchSearchKey = 'batch_0001';

    getAccountDetail() {
        // private res;

        this.queries.getAccountDetail(this.QUERY_OPTIONS, {
          accountId: this.accountKey,
          key: this.batchKeySearch,
          pageSize: 100,
          paginationKey: this.batchKeySearch,
          paginationWriter: this.accountKey,
          writer: this.accountKey,
        }).then((resp) => {
            this.getAccountDetail$ = resp;
        })
        .catch((err) => {
          console.log(err);
        });
        return this.getAccountDetail$;
       
    }

    setAccountDetail(batchReq: any){
        // "crudeExtract": BatchInformation,
        // "unboundFiltrate": BatchInformation,
        // "finalElution": BatchInformation,
        // "unaccounted": BatchInformation,
        // "notes": [],
        // "batchStatus": BatchStatus,
        // "batchRequest": BatchRequest
         this.extractionBatch$ = {
            crudeExtract: batchReq.crudeExtract,
            unboundFiltrate: batchReq.unboundFiltrate,
            finalElution: batchReq.finalElution,
            unaccounted: batchReq.unaccounted,
            notes: batchReq.notes,
            batchStatus: batchReq.batchStatus,
            batchRequest: batchReq.batchRequest,
         } 
        // this.extractionBatch$ = {
        //     ...batchReq
        // }
        console.log("\n\nbatch1::: "+JSON.stringify(this.extractionBatch$));
        this.commands.setAccountDetail(this.COMMAND_OPTIONS,{
            accountId: this.adminAccount,
            key: this.extractionBatch$.batchRequest.batchId,
            value: escapeJSON(this.extractionBatch$)
          })
        .then(resp => {
            this.setAccountDetail$ = resp;
            console.log("resp:::: "+JSON.stringify(resp));
            console.log("setAccountDetail:::: "+JSON.stringify(this.setAccountDetail$));
            return this.setAccountDetail$;
        })
        .catch((err) => {
            console.log(err);
            return err;
          });
        console.log("final::: "+this.setAccountDetail$);
        return this.setAccountDetail$;
    }
  }
  
  export = new ThemeAController();