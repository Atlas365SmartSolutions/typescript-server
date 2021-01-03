import grpc from 'grpc';
import {
    CommandService_v1Client as CommandService
  } from 'iroha-helpers-ts/lib/proto/endpoint_grpc_pb';
  import commandsInit from 'iroha-helpers-ts/lib/commands/index';
import { escapeJSON, returnJSON } from '../utils/utils';
import { BehaviorSubject } from 'rxjs';
import { CommandErrorResponse, CommandResponse } from '../interfaces/iroha/CommandRequests';
class CommandsController {

    // COMMANDS
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
    private adminPriv = 'f101537e319568c765b2cc89698325604991dca57b9716b58016b253506cab70';
    private commands = commandsInit;
    
    private COMMAND_OPTIONS = {
        privateKeys: [this.adminPriv],
        creatorAccountId: this.adminAccount,
        quorum: 1,
        commandService: this.commandService,
        timeoutLimit: 1000000,
    };

      // COMMANDS
    addAssetQuantity(addAssetQuantityRequest: any): Promise<any> {
      console.log(addAssetQuantityRequest);
      return this.commands.addAssetQuantity(this.COMMAND_OPTIONS, addAssetQuantityRequest)
        .then((resp: any) => {
          let commandResponse = new CommandResponse();
          commandResponse = resp;
          console.log("sending command response for addAssetQuantity ::", commandResponse);
          return commandResponse;
        })
        .catch((err) => {
          let commandErrorResponse = new CommandErrorResponse();
          commandErrorResponse.error = err.message;
          commandErrorResponse.status = err.message.split("actual=")[1];

          console.log('Received error while sending command: ' + commandErrorResponse);
          return commandErrorResponse;
        });
    };

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
    };
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
    };
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
    };
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
    };
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
    };
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
    };
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
    };
    createRole(roleName: String, permissionsList: Array<Number>){
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
    };
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
    };
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
    };
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
    };
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
    };
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
    };
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
    };
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
    };
    subtractAssetQuantity(assetId: String, amount: String){
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
    };
    transferAsset(srcAccountId: String, destAccountId: String, assetId: String, description: String, amount: String){
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
    };
  }
  
  export = new CommandsController();