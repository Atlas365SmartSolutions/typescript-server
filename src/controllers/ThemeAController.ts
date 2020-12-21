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

    // COMMANDS
    addAssetQuantity$ = new BehaviorSubject<any>(null);
    addPeer$ = new BehaviorSubject<any>(null);
    addSignatory$ = new BehaviorSubject<any>(null);
    appendRole$ = new BehaviorSubject<any>(null);
    compareAndSetAccountDetail$ = new BehaviorSubject<any>(null);
    createAccount$ = new BehaviorSubject<any>(null);
    createAsset$ = new BehaviorSubject<any>(null);
    createDomain$ = new BehaviorSubject<any>(null);
    createRole$ = new BehaviorSubject<any>(null);
    detachRole$ = new BehaviorSubject<any>(null);
    grantPermission$ = new BehaviorSubject<any>(null);
    removePeer$ = new BehaviorSubject<any>(null);
    removeSignatory$ = new BehaviorSubject<any>(null);
    revokePermission$ = new BehaviorSubject<any>(null);
    setAccountDetail$ = new BehaviorSubject<any>(null);
    setAccountQuorum$ = new BehaviorSubject<any>(null);
    subtractAssetQuantity$ = new BehaviorSubject<any>(null);
    transferAsset$ = new BehaviorSubject<any>(null);
    
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

    // QUERIES

    // TO DO - CHECK IF IT WORKS
    getAccount(accountId: any) {
        this.queries.getAccount(this.QUERY_OPTIONS, {
          accountId: accountId
        }).then((resp: any) => {
            this.getAccount$.next({response:returnJSON(resp), error: null});
        })
        .catch((err) => {
          this.getAccount$.next({response:null, error: err.message});
        });
    }

    getAccountTransactions(accountId: String) {
      this.queries.getAccountTransactions(this.QUERY_OPTIONS, {
        accountId: accountId,
        pageSize: 100
      }).then((resp: any) => {
          this.getAccountTransactions$.next({response:returnJSON(resp), error: null});
      })
      .catch((err) => {
        this.getAccountTransactions$.next({response:null, error: err.message});
      });
    }

    getAccountAssets(accountId: any, assetId: any) {
      this.queries.getAccountAssets(this.QUERY_OPTIONS, {
        accountId: accountId,
        pageSize: 100,
        firstAssetId: assetId,
      }).then((resp: any) => {
          this.getAccountAssets$.next({response:returnJSON(resp), error: null});
      })
      .catch((err) => {
        this.getAccountAssets$.next({response:null, error: err.message});
      });
    }

    getAccountDetail(accountId: any, key: any) {
      this.queries.getAccountDetail(this.QUERY_OPTIONS, {
        accountId: accountId,
        key: key,
        pageSize: 100,
        paginationKey: key,
        paginationWriter: accountId,
        writer: accountId,
      }).then((resp) => {
          this.getAccountDetail$.next({response:returnJSON(resp), error: null});
      })
      .catch((err) => {
        this.getAccountDetail$.next({response:null, error: err.message});
      });
  }

    getAccountAssetTransactions(accountId: any, assetId: any, firstTxHash: any) {
      this.queries.getAccountAssetTransactions(this.QUERY_OPTIONS, {
        accountId: accountId,
        assetId: assetId,
        pageSize: 100,
        firstTxHash: firstTxHash
      }).then((resp: any) => {
          this.getAccountAssetTransactions$.next({response:returnJSON(resp), error: null});
      })
      .catch((err) => {
        this.getAccountAssetTransactions$.next({response:null, error: err.message});
      });
    }

    getAssetInfo(assetId: String) {
      this.queries.getAssetInfo(this.QUERY_OPTIONS, {
        assetId: assetId
      }).then((resp: any) => {
          this.getAssetInfo$.next({response:returnJSON(resp), error: null});
      })
      .catch((err) => {
        this.getAssetInfo$.next({response:null, error: err.message});
      });
    }

    getBlock(height: Number) {
      this.queries.getBlock(this.QUERY_OPTIONS, {
        height: height
      }).then((resp: any) => {
          this.getBlock$.next({response:returnJSON(resp), error: null});
      })
      .catch((err) => {
        this.getBlock$.next({response:null, error: err.message});
      });
    }

    getEngineReceipts(txHash: Number) {
      this.queries.getEngineReceipts(this.QUERY_OPTIONS, {
        txHash: txHash
      }).then((resp: any) => {
          this.getEngineReceipts$.next({response:returnJSON(resp), error: null});
      })
      .catch((err) => {
        this.getEngineReceipts$.next({response:null, error: err.message});
      });
    }

    getPeers() {
      this.queries.getPeers(this.QUERY_OPTIONS
      ).then((resp: any) => {
          this.getPeers$.next({response:returnJSON(resp), error: null});
      })
      .catch((err) => {
        this.getPeers$.next({response:null, error: err.message});
      });
    }

    getPendingTransactions(firstTxHash: any) {
      this.queries.getPendingTransactions(this.QUERY_OPTIONS, {
        pageSize: 100,
        firstTxHash: firstTxHash
      }).then((resp: any) => {
          this.getPendingTransactions$.next({response:returnJSON(resp), error: null});
      })
      .catch((err) => {
        this.getPendingTransactions$.next({response:null, error: err.message});
      });
    }

    getRawAccount(accountId: String) {
      this.queries.getRawAccount(this.QUERY_OPTIONS, {
        accountId: accountId
      }).then((resp: any) => {
          this.getRawAccount$.next({response:returnJSON(resp), error: null});
      })
      .catch((err) => {
        this.getRawAccount$.next({response:null, error: err.message});
      });
    }

    getRawPendingTransactions() {
      this.queries.getRawPendingTransactions(this.QUERY_OPTIONS).then((resp: any) => {
          this.getRawPendingTransactions$.next({response:returnJSON(resp), error: null});
      })
      .catch((err) => {
        this.getRawPendingTransactions$.next({response:null, error: err.message});
      });
    }

    getRolePermissions(roleId: Number) {
      this.queries.getRolePermissions(this.QUERY_OPTIONS, {
        roleId: roleId
      }).then((resp: any) => {
          this.getRolePermissions$.next({response:returnJSON(resp), error: null});
      })
      .catch((err) => {
        this.getRolePermissions$.next({response:null, error: err.message});
      });
    }

    getRoles() {
      this.queries.getRoles(this.QUERY_OPTIONS).then((resp: any) => {
          this.getRoles$.next({response:returnJSON(resp), error: null});
      })
      .catch((err) => {
        this.getRoles$.next({response:null, error: err.message});
      });
    }

    getSignatories(accountId: String) {
      this.queries.getSignatories(this.QUERY_OPTIONS, {
        accountId: accountId
      }).then((resp: any) => {
          this.getSignatories$.next({response:returnJSON(resp), error: null});
      })
      .catch((err) => {
        this.getSignatories$.next({response:null, error: err.message});
      });
    }

    getTransactions(txHashesList: String[]) {
      this.queries.getTransactions(this.QUERY_OPTIONS, {
        txHashesList: txHashesList
      }).then((resp: any) => {
          this.getTransactions$.next({response:returnJSON(resp), error: null});
      })
      .catch((err) => {
        this.getTransactions$.next({response:null, error: err.message});
      });
    }

      // COMMANDS
    addAssetQuantity(accountId: String, amount: Number){
        this.commands.addAssetQuantity(this.COMMAND_OPTIONS,{
              accountId: accountId,
              amount: amount
            })
          .then((resp: any) => {
              this.addAssetQuantity$.next({response:returnJSON(resp), error: null});
          })
          .catch((err) => {
              this.addAssetQuantity$.next({response: null, error: err.message});
            });
    }

    addPeer(address: String, peerKey: String){
      this.commands.addPeer(this.COMMAND_OPTIONS,{
          address: address,
          peerKey: peerKey
          })
        .then((resp: any) => {
            this.addPeer$.next({response:returnJSON(resp), error: null});
        })
        .catch((err) => {
            this.addPeer$.next({response: null, error: err.message});
          });
    }

    addSignatory(address: String, publicKey: String){
      this.commands.addSignatory(this.COMMAND_OPTIONS,{
          address: address,
          publicKey: publicKey
        })
      .then((resp: any) => {
            this.addSignatory$.next({response:returnJSON(resp), error: null});
      })
      .catch((err) => {
          this.addSignatory$.next({response: null, error: err.message});
        });
    }

    appendRole(accountId: String, roleName: String){
      this.commands.appendRole(this.COMMAND_OPTIONS,{
            accountId: accountId,
            roleName: roleName
          })
        .then((resp: any) => {
            this.appendRole$.next({response:returnJSON(resp), error: null});
        })
        .catch((err) => {
            this.appendRole$.next({response: null, error: err.message});
          });
    }

    compareAndSetAccountDetail(accountId: any, key: any, value: any, oldValue: any){
      this.commands.compareAndSetAccountDetail(this.COMMAND_OPTIONS, {
        accountId: accountId,
        key: key,
        value: value,
        oldValue: oldValue,
    })
        .then((resp: any) => {
            this.compareAndSetAccountDetail$.next({response:returnJSON(resp), error: null});
        })
        .catch((err) => {
            this.compareAndSetAccountDetail$.next({response: null, error: err.message});
          });
    }

    createAccount(accountName: String, domainId: String, publicKey: String){
      this.commands.createAccount(this.COMMAND_OPTIONS, {
        accountName: accountName,
        domainId: domainId,
        publicKey: publicKey
    })
        .then((resp: any) => {
            this.createAccount$.next({response:returnJSON(resp), error: null});
        })
        .catch((err) => {
            this.createAccount$.next({response: null, error: err.message});
          });
    }

    createAsset(assetName: String, domainId: String, precision: Number){
      this.commands.createAsset(this.COMMAND_OPTIONS, {
        assetName: assetName,
        domainId: domainId,
        precision: precision
    })
        .then((resp: any) => {
            this.createAccount$.next({response:returnJSON(resp), error: null});
        })
        .catch((err) => {
            this.createAccount$.next({response: null, error: err.message});
          });
    }

    createDomain(domainId: String, defaultRole: String){
      this.commands.createDomain(this.COMMAND_OPTIONS, {
        domainId: domainId,
        defaultRole: defaultRole
    })
        .then((resp: any) => {
            this.createDomain$.next({response:returnJSON(resp), error: null});
        })
        .catch((err) => {
            this.createDomain$.next({response: null, error: err.message});
          });
    }

    createRole(roleName: String, permissionsList: Number[]){
      this.commands.createRole(this.COMMAND_OPTIONS, {
        roleName: roleName,
        permissionsList: permissionsList
    })
        .then((resp: any) => {
            this.createRole$.next({response:returnJSON(resp), error: null});
        })
        .catch((err) => {
            this.createRole$.next({response: null, error: err.message});
          });
    }

    detachRole(accountId: String, roleName: String){
      this.commands.detachRole(this.COMMAND_OPTIONS, {
        accountId: accountId,
        roleName: roleName
    })
        .then((resp: any) => {
            this.detachRole$.next({response:returnJSON(resp), error: null});
        })
        .catch((err) => {
            this.detachRole$.next({response: null, error: err.message});
          });
    }

    grantPermission(accountId: String, permission: String){
      this.commands.grantPermission(this.COMMAND_OPTIONS, {
        accountId: accountId,
        permission: permission
    })
        .then((resp: any) => {
            this.grantPermission$.next({response:returnJSON(resp), error: null});
        })
        .catch((err) => {
            this.grantPermission$.next({response: null, error: err.message});
          });
    }

    removePeer(publicKey: String){
      this.commands.removePeer(this.COMMAND_OPTIONS, {
        publicKey: publicKey
    })
        .then((resp: any) => {
            this.removePeer$.next({response:returnJSON(resp), error: null});
        })
        .catch((err) => {
            this.removePeer$.next({response: null, error: err.message});
          });
    }

    removeSignatory(accountId: String, publicKey: String){
      this.commands.removeSignatory(this.COMMAND_OPTIONS, {
        accountId: accountId,
        publicKey: publicKey
    })
        .then((resp: any) => {
            this.removeSignatory$.next({response:returnJSON(resp), error: null});
        })
        .catch((err) => {
            this.removeSignatory$.next({response: null, error: err.message});
          });
    }

    revokePermission(accountId: String, permission: String){
      this.commands.revokePermission(this.COMMAND_OPTIONS, {
        accountId: accountId,
        permission: permission
    })
        .then((resp: any) => {
            this.revokePermission$.next({response:returnJSON(resp), error: null});
        })
        .catch((err) => {
            this.revokePermission$.next({response: null, error: err.message});
          });
    }
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

    setAccountQuorum(accountId: String, quorum: Number){
      this.commands.setAccountQuorum(this.COMMAND_OPTIONS,{
            accountId: accountId,
            quorum: quorum
          })
        .then((resp: any) => {
            this.setAccountQuorum$.next({response:returnJSON(resp), error: null});
        })
        .catch((err) => {
            this.setAccountQuorum$.next({response: null, error: err.message});
          });
    }

    subtractAssetQuantity(assetId: String, amount: Number){
      this.commands.subtractAssetQuantity(this.COMMAND_OPTIONS,{
            assetId: assetId,
            amount: amount
          })
        .then((resp: any) => {
            this.subtractAssetQuantity$.next({response:returnJSON(resp), error: null});
        })
        .catch((err) => {
            this.subtractAssetQuantity$.next({response: null, error: err.message});
          });
    }

    transferAsset(srcAccountId: String, destAccountId: String, assetId: String, description: String, amount: Number){
      this.commands.transferAsset(this.COMMAND_OPTIONS,{
            srcAccountId: srcAccountId,
            destAccountId: destAccountId,
            assetId: assetId,
            description: description,
            amount: amount
          })
        .then((resp: any) => {
            this.transferAsset$.next({response:returnJSON(resp), error: null});
        })
        .catch((err) => {
            this.transferAsset$.next({response: null, error: err.message});
          });
    }
  }
  
  export = new ThemeAController();