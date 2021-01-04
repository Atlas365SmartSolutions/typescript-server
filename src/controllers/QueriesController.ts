import grpc from 'grpc';
import {
    QueryService_v1Client as QueryService
  } from 'iroha-helpers-ts/lib/proto/endpoint_grpc_pb';
import queriesInit from 'iroha-helpers-ts/lib/queries/index';
import { setIrohaErrorResp, setIrohaSuccessResp } from '../utils/utils'
import { AccountResponse, SignatoriesResponse,
        TransactionsResponse, PendingTransactionsPageResponse,
        TransactionsPageResponse, AccountAssetResponse,
        AccountDetailResponse, Asset, PeersResponse,
        RolesResponse, RolePermissionsResponse,
        BlockResponse,
        EngineReceiptsResponse
       } from '../interfaces/Interfaces';
import { GetAccountAssetsRequest, GetAccountAssetTransactionsRequest, GetAccountDetailRequest, GetAccountRequest, GetAccountTransactionsRequest, GetAssetInfoRequest, GetBlockRequest, GetEngineReceiptsRequest, GetPendingTxsRequest, GetRawAccountRequest, GetRolePermissionsRequest, GetSignatoriesRequest, GetTransactionsRequest } from '../interfaces/iroha/QueryRequests';

class QueriesController {

  // QUERIES
    private IROHA_ADDRESS = 'localhost:50051';
    private adminAccount = 'admin@test';
    private queryService = new QueryService(this.IROHA_ADDRESS, grpc.credentials.createInsecure());
    private adminPriv = 'f101537e319568c765b2cc89698325604991dca57b9716b58016b253506cab70';
    private queries = queriesInit;

    private QUERY_OPTIONS = {
        privateKey: this.adminPriv,
        creatorAccountId: this.adminAccount,
        queryService: this.queryService,
        timeoutLimit: 5000,
    };

    // QUERIES

    // TO DO - CHECK IF IT WORKS
    getAccount(getAccountRequest: GetAccountRequest) : Promise<any> {
      return this.queries.getAccount(this.QUERY_OPTIONS, getAccountRequest)
        .then((resp: any) => {
          return setIrohaSuccessResp(resp);      
        })
        .catch((err) => {
          return setIrohaErrorResp(err);          
        }); 
    };

    getAccountTransactions(getAccountTransactionsRequest: GetAccountTransactionsRequest): Promise<any> {
      return this.queries.getAccountTransactions(this.QUERY_OPTIONS, getAccountTransactionsRequest)
        .then((resp: any) => {
          return setIrohaSuccessResp(resp);      
        })
        .catch((err) => {
          return setIrohaErrorResp(err);          
        }); 
    };

    getAccountAssets(getAccountAssetsRequest: GetAccountAssetsRequest): Promise<any> {
      return this.queries.getAccountAssets(this.QUERY_OPTIONS, getAccountAssetsRequest)
      .then((resp: any) => {
        return setIrohaSuccessResp(resp);      
      })
      .catch((err) => {
        return setIrohaErrorResp(err);          
      }); 
    };
    
    getAccountDetail(getAccountDetailRequest: GetAccountDetailRequest): Promise<any> {
      return this.queries.getAccountDetail(this.QUERY_OPTIONS, getAccountDetailRequest)
        .then((resp: any) => {
          return setIrohaSuccessResp(resp);      
        })
        .catch((err) => {
          return setIrohaErrorResp(err);          
      }); 
    };

    // NEED TO SET UP TRANSACTION
    getAccountAssetTransactions(getAccountAssetTransactionsRequest: GetAccountAssetTransactionsRequest): Promise<any> {
      return this.queries.getAccountAssetTransactions(this.QUERY_OPTIONS, getAccountAssetTransactionsRequest)
        .then((resp: any) => {
          return setIrohaSuccessResp(resp);      
        })
        .catch((err) => {
          return setIrohaErrorResp(err);          
      }); 
    };

    getAssetInfo(getAssetInfoRequest: GetAssetInfoRequest): Promise<any> {
      return this.queries.getAssetInfo(this.QUERY_OPTIONS, getAssetInfoRequest)
        .then((resp: any) => {
          return setIrohaSuccessResp(resp);      
        })
        .catch((err) => {
          return setIrohaErrorResp(err);          
      }); 
    };
    
    getBlock(getBlockRequest: GetBlockRequest): Promise<any> {
      return this.queries.getBlock(this.QUERY_OPTIONS, getBlockRequest)
        .then((resp: any) => {
          return setIrohaSuccessResp(resp);      
        })
        .catch((err) => {
          return setIrohaErrorResp(err);          
      }); 
    };
    // MIGHT NEED TO DO ADDITIONAL WORK IN IROHA HELPERS "Protobuf Query: [[query is undefined ]]""
    getEngineReceipts(getEngineReceiptsRequest: GetEngineReceiptsRequest): Promise<any> {
      return this.queries.getEngineReceipts(this.QUERY_OPTIONS, getEngineReceiptsRequest)
        .then((resp: any) => {
          return setIrohaSuccessResp(resp);      
        })
        .catch((err) => {
          return setIrohaErrorResp(err);          
      }); 
    };
      // NEED can_get_peers PERMISSION
    getPeers(): Promise<any>{
      return this.queries.getPeers(this.QUERY_OPTIONS)
        .then((resp: any) => {
          return setIrohaSuccessResp(resp);      
        })
        .catch((err) => {
          return setIrohaErrorResp(err);          
      }); 
    };

    getPendingTransactions(getPendingTxsRequest: GetPendingTxsRequest): Promise<any> {
      return this.queries.getPendingTransactions(this.QUERY_OPTIONS, getPendingTxsRequest)
        .then((resp: any) => {
          return setIrohaSuccessResp(resp);      
        })
        .catch((err) => {
          return setIrohaErrorResp(err);          
      }); 
    };

    getRawAccount(getRawAccountRequest: GetRawAccountRequest):Promise<any> {
      return this.queries.getRawAccount(this.QUERY_OPTIONS, getRawAccountRequest)
        .then((resp: any) => {
          return setIrohaSuccessResp(resp);      
        })
        .catch((err) => {
          return setIrohaErrorResp(err);          
      }); 
    };

    getRawPendingTransactions():Promise<any> {
      return this.queries.getRawPendingTransactions(this.QUERY_OPTIONS)
        .then((resp: any) => {
          return setIrohaSuccessResp(resp);      
        })
        .catch((err) => {
          return setIrohaErrorResp(err);          
      }); 
    };

    getRolePermissions(getRolePermissionsRequest: GetRolePermissionsRequest): Promise<any> {
      return this.queries.getRolePermissions(this.QUERY_OPTIONS, getRolePermissionsRequest)
        .then((resp: any) => {
          return setIrohaSuccessResp(resp);      
        })
        .catch((err) => {
          return setIrohaErrorResp(err);          
      }); 
    };

    getRoles(): Promise<any> {
      return this.queries.getRoles(this.QUERY_OPTIONS)
        .then((resp: any) => {
          return setIrohaSuccessResp(resp);      
        })
        .catch((err) => {
          return setIrohaErrorResp(err);          
      }); 
    };

    getSignatories(getSignatoriesRequest: GetSignatoriesRequest): Promise<any> {
      return this.queries.getSignatories(this.QUERY_OPTIONS, getSignatoriesRequest)
        .then((resp: any) => {
          return setIrohaSuccessResp(resp);      
        })
        .catch((err) => {
          return setIrohaErrorResp(err);          
      }); 
    };
    getTransactions(getTransactionsRequest: GetTransactionsRequest): Promise<any> {
      return this.queries.getTransactions(this.QUERY_OPTIONS, getTransactionsRequest)
        .then((resp: any) => {
          return setIrohaSuccessResp(resp);      
        })
        .catch((err) => {
          return setIrohaErrorResp(err);          
      }); 
    };

  }
  
  export = new QueriesController();