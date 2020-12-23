import grpc from 'grpc';
import {
    QueryService_v1Client as QueryService
  } from 'iroha-helpers/lib/proto/endpoint_grpc_pb';
import queriesInit from 'iroha-helpers/lib/queries/index';
import { returnJSON } from '../utils/utils'
import { BehaviorSubject } from 'rxjs'
import { AccountResponse, SignatoriesResponse,
        TransactionsResponse, PendingTransactionsPageResponse,
        TransactionsPageResponse, AccountAssetResponse,
        AccountDetailResponse, Asset, PeersResponse,
        RolesResponse, RolePermissionsResponse,
        BlockResponse
       } from '../interfaces/Interfaces';

class QueriesController {

  // QUERIES
    getAccount$ = new BehaviorSubject<any>(null);
    getAccountTransactions$ = new BehaviorSubject<any>(null);
    getAccountAssets$ = new BehaviorSubject<any>(null);
    getAccountDetail$ = new BehaviorSubject<any>(null);
    getAccountAssetTransactions$ = new BehaviorSubject<any>(null);
    getAssetInfo$ = new BehaviorSubject<any>(null);
    getBlock$ = new BehaviorSubject<any>(null);
    getEngineReceipts$ = new BehaviorSubject<any>(null);
    getPeers$ = new BehaviorSubject<any>(null);
    getPendingTransactions$ = new BehaviorSubject<any>(null);
    getRawAccount$ = new BehaviorSubject<any>(null);
    getRawPendingTransactions$ = new BehaviorSubject<any>(null);
    getRolePermissions$ = new BehaviorSubject<any>(null);
    getRoles$ = new BehaviorSubject<any>(null);
    getSignatories$ = new BehaviorSubject<any>(null);
    getTransactions$ = new BehaviorSubject<any>(null);
    
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
    getAccount(accountId: any) {
        this.queries.getAccount(this.QUERY_OPTIONS, {
          accountId: accountId
        }).then((resp: AccountResponse) => {
            this.getAccount$.next({response:returnJSON(resp.account?.json_data), error: null});
        })
        .catch((err) => {
          this.getAccount$.next({response:null, error: err.message});
        });
    };
    getAccountTransactions(accountId: String) {
      this.queries.getAccountTransactions(this.QUERY_OPTIONS, {
        accountId: accountId,
        pageSize: 100
      }).then((resp: TransactionsPageResponse) => {
          this.getAccountTransactions$.next({response:returnJSON(resp), error: null});
      })
      .catch((err) => {
        this.getAccountTransactions$.next({response:null, error: err.message});
      });
    };
    getAccountAssets(accountId: any, assetId: any) {
      this.queries.getAccountAssets(this.QUERY_OPTIONS, {
        accountId: accountId,
        pageSize: 100,
        firstAssetId: assetId,
      }).then((resp: AccountAssetResponse) => {
          this.getAccountAssets$.next({response:returnJSON(resp), error: null});
      })
      .catch((err) => {
        this.getAccountAssets$.next({response:null, error: err.message});
      });
    };
    getAccountDetail(accountId: any, key: any) {
      this.queries.getAccountDetail(this.QUERY_OPTIONS, {
        accountId: accountId,
        key: key,
        pageSize: 100,
        paginationKey: key,
        paginationWriter: accountId,
        writer: accountId,
      }).then((resp: AccountDetailResponse) => {
          this.getAccountDetail$.next({response:returnJSON(resp), error: null});
      })
      .catch((err) => {
        this.getAccountDetail$.next({response:null, error: err.message});
      });
    };
    getAccountAssetTransactions(accountId: any, assetId: any, firstTxHash: any) {
      this.queries.getAccountAssetTransactions(this.QUERY_OPTIONS, {
        accountId: accountId,
        assetId: assetId,
        pageSize: 100,
        firstTxHash: firstTxHash
      }).then((resp: TransactionsPageResponse) => {
          this.getAccountAssetTransactions$.next({response:returnJSON(resp), error: null});
      })
      .catch((err) => {
        this.getAccountAssetTransactions$.next({response:null, error: err.message});
      });
    };
    getAssetInfo(assetId: String) {
      this.queries.getAssetInfo(this.QUERY_OPTIONS, {
        assetId: assetId
      }).then((resp: Asset) => {
          this.getAssetInfo$.next({response:returnJSON(resp), error: null});
      })
      .catch((err) => {
        this.getAssetInfo$.next({response:null, error: err.message});
      });
    };
    getBlock(height: Number) {
      this.queries.getBlock(this.QUERY_OPTIONS, {
        height: height
      }).then((resp: BlockResponse) => {
          this.getBlock$.next({response:returnJSON(resp.block), error: null});
      })
      .catch((err) => {
        this.getBlock$.next({response:null, error: err.message});
      });
    };
    getEngineReceipts(txHash: Number) {
      this.queries.getEngineReceipts(this.QUERY_OPTIONS, {
        txHash: txHash
      }).then((resp: BlockResponse) => {
          this.getEngineReceipts$.next({response:returnJSON(resp.block), error: null});
      })
      .catch((err) => {
        this.getEngineReceipts$.next({response:null, error: err.message});
      });
    };
    getPeers() {
      this.queries.getPeers(this.QUERY_OPTIONS
      ).then((resp: PeersResponse) => {
          this.getPeers$.next({response:returnJSON(resp.peers), error: null});
      })
      .catch((err) => {
        this.getPeers$.next({response:null, error: err.message});
      });
    };
    getPendingTransactions(firstTxHash: any) {
      this.queries.getPendingTransactions(this.QUERY_OPTIONS, {
        pageSize: 100,
        firstTxHash: firstTxHash
      }).then((resp: PendingTransactionsPageResponse) => {
          this.getPendingTransactions$.next({response:returnJSON(resp), error: null});
      })
      .catch((err) => {
        this.getPendingTransactions$.next({response:null, error: err.message});
      });
    };
    getRawAccount(accountId: String) {
      this.queries.getRawAccount(this.QUERY_OPTIONS, {
        accountId: accountId
      }).then((resp: AccountResponse) => {
          this.getRawAccount$.next({response:returnJSON(resp.account?.json_data), error: null});
      })
      .catch((err) => {
        this.getRawAccount$.next({response:null, error: err.message});
      });
    };
    getRawPendingTransactions() {
      this.queries.getRawPendingTransactions(this.QUERY_OPTIONS).then((resp: PendingTransactionsPageResponse) => {
          this.getRawPendingTransactions$.next({response:returnJSON(resp), error: null});
      })
      .catch((err) => {
        this.getRawPendingTransactions$.next({response:null, error: err.message});
      });
    };
    getRolePermissions(roleId: Number) {
      this.queries.getRolePermissions(this.QUERY_OPTIONS, {
        roleId: roleId
      }).then((resp: RolePermissionsResponse) => {
          this.getRolePermissions$.next({response:returnJSON(resp.permissions), error: null});
      })
      .catch((err) => {
        this.getRolePermissions$.next({response:null, error: err.message});
      });
    };
    getRoles() {
      this.queries.getRoles(this.QUERY_OPTIONS).then((resp: RolesResponse) => {
          this.getRoles$.next({response:returnJSON(resp.roles), error: null});
      })
      .catch((err) => {
        this.getRoles$.next({response:null, error: err.message});
      });
    };
    getSignatories(accountId: String) {
      this.queries.getSignatories(this.QUERY_OPTIONS, {
        accountId: accountId
      }).then((resp: SignatoriesResponse) => {
          this.getSignatories$.next({response:returnJSON(resp.keys), error: null});
      })
      .catch((err) => {
        this.getSignatories$.next({response:null, error: err.message});
      });
    };
    getTransactions(txHashesList: Array<String>) {
      this.queries.getTransactions(this.QUERY_OPTIONS, {
        txHashesList: txHashesList
      }).then((resp: TransactionsResponse) => {
          this.getTransactions$.next({response:returnJSON(resp.transactions), error: null});
      })
      .catch((err) => {
        this.getTransactions$.next({response:null, error: err.message});
      });
    };

  }
  
  export = new QueriesController();