import * as grpc from 'grpc';
import {
    CommandService_v1Client as CommandService
  } from 'iroha-helpers-ts/lib/proto/endpoint_grpc_pb';
import commandsInit from 'iroha-helpers-ts/lib/commands/index';
import { setIrohaErrorResp, setIrohaSuccessResp } from '../common/Utils';
import { AdjustAssetQuantityRequest, AddPeerRequest, AddSignatoryRequest, AppendRoleRequest, CompareAndSetAccountDetailRequest, CreateAccountRequest, CreateAssetRequest, CreateDomainRequest, CreateRoleRequest, DetachRoleRequest, GrantablePermissionRequest, RemovePeerRequest, RemoveSignatoryRequest, RevokePermissionRequest, SetAccountDetailRequest, SetAccountQuorumRequest, TransferAssetRequest } from '../interfaces/iroha/CommandRequests';
import { IROHA_ADMIN_ACCOUNT, IROHA_ADMIN_PRIM_KEY, IROHA_PEER_ADDR } from '../common/Constants';

class CommandsController {

    // COMMANDS    
    private adminAccount = IROHA_ADMIN_ACCOUNT;
    private commandService = new CommandService(IROHA_PEER_ADDR,grpc.credentials.createInsecure());
    private adminPriv = IROHA_ADMIN_PRIM_KEY;
    private commands = commandsInit;
    
    private COMMAND_OPTIONS = {
        privateKeys: [this.adminPriv],
        creatorAccountId: this.adminAccount,
        quorum: 1,
        commandService: this.commandService,
        timeoutLimit: 1000000,
    };

      // COMMANDS
    addAssetQuantity(addAssetQuantityRequest: AdjustAssetQuantityRequest): Promise<any> {
      return this.commands.addAssetQuantity(this.COMMAND_OPTIONS, {
        assetId: addAssetQuantityRequest.assetId,
        amount: addAssetQuantityRequest.amount
      })
        .then((resp: any) => {
          return setIrohaSuccessResp(resp);      
        })
        .catch((err) => {
          return setIrohaErrorResp(err);          
        });
    };
    //TODO:: FIX THIS COMMAND
    addPeer(addPeerRequest: AddPeerRequest): Promise<any>{
      return this.commands.addPeer(this.COMMAND_OPTIONS, {
        address: addPeerRequest.address,
        peerKey: addPeerRequest.peerKey
      })
        .then((resp: any) => {
          return setIrohaSuccessResp(resp);      
        })
        .catch((err) => {
          return setIrohaErrorResp(err);          
        });
    };
    //END TODO

    //TODO:: FIX THIS COMMAND
    addSignatory(addSignatoryRequest: AddSignatoryRequest): Promise<any> {
      return this.commands.addSignatory(this.COMMAND_OPTIONS,{
        accountId: addSignatoryRequest.accountId,
        publicKey: addSignatoryRequest.publicKey
      })
        .then((resp: any) => {
          return setIrohaSuccessResp(resp);      
        })
        .catch((err) => {
          return setIrohaErrorResp(err);          
        });
    };
    //END TODO

    appendRole(appendRoleRequest: AppendRoleRequest): Promise<any> {
      return this.commands.appendRole(this.COMMAND_OPTIONS,{
        accountId: appendRoleRequest.accountId,
        roleName: appendRoleRequest.roleName})
        .then((resp: any) => {
          return setIrohaSuccessResp(resp);      
        })
        .catch((err) => {
          return setIrohaErrorResp(err);          
        });
    };

    compareAndSetAccountDetail(compareAndSetAccountDetailRequest: CompareAndSetAccountDetailRequest): Promise<any>{
      return this.commands.compareAndSetAccountDetail(this.COMMAND_OPTIONS, {
        accountId: compareAndSetAccountDetailRequest.accountId,
        key: compareAndSetAccountDetailRequest.key,
        value: compareAndSetAccountDetailRequest.value,
        oldValue: compareAndSetAccountDetailRequest.oldValue
      })
        .then((resp: any) => {
          return setIrohaSuccessResp(resp);      
        })
        .catch((err) => {
          return setIrohaErrorResp(err);          
        });
    };

    createAccount(createAccountRequest: CreateAccountRequest): Promise<any> {
      return this.commands.createAccount(this.COMMAND_OPTIONS, {
        accountName: createAccountRequest.accountName,
        domainId: createAccountRequest.domainId,
        publicKey: createAccountRequest.publicKey
      })
        .then((resp: any) => {
          return setIrohaSuccessResp(resp);      
        })
        .catch((err) => {
          return setIrohaErrorResp(err);          
        });
    };

    createAsset(createAssetRequest: CreateAssetRequest): Promise<any>{
      return this.commands.createAsset(this.COMMAND_OPTIONS, {
        assetName: createAssetRequest.assetName,
        domainId: createAssetRequest.domainId,
        precision: createAssetRequest.precision
      })
        .then((resp: any) => {
          return setIrohaSuccessResp(resp);      
        })
        .catch((err) => {
          return setIrohaErrorResp(err);          
        });
    };

    createDomain(createDomainRequest: CreateDomainRequest): Promise<any>{
      return this.commands.createDomain(this.COMMAND_OPTIONS, {
        domainId: createDomainRequest.domainId,
        defaultRole: createDomainRequest.defaultRole
      })
        .then((resp: any) => {
          return setIrohaSuccessResp(resp);      
        })
        .catch((err) => {
          return setIrohaErrorResp(err);          
        });
    };

    createRole(createRoleRequest: CreateRoleRequest): Promise<any>{
      return this.commands.createRole(this.COMMAND_OPTIONS, {
        roleName: createRoleRequest.roleName,
        permissionsList: createRoleRequest.permissionsList
      })
        .then((resp: any) => {
          return setIrohaSuccessResp(resp);      
        })
        .catch((err) => {
          return setIrohaErrorResp(err);          
        });
    };

    detachRole(detachRoleRequest: DetachRoleRequest): Promise<any>{
      return this.commands.detachRole(this.COMMAND_OPTIONS, {
        accountId: detachRoleRequest.accountId,
        roleName: detachRoleRequest.roleName
      })
        .then((resp: any) => {
          return setIrohaSuccessResp(resp);      
        })
        .catch((err) => {
          return setIrohaErrorResp(err);          
        });
    };

    grantPermission(grantablePermissionRequest: GrantablePermissionRequest){
      return this.commands.grantPermission(this.COMMAND_OPTIONS, {
        accountId: grantablePermissionRequest.accountId,
        permission: grantablePermissionRequest.permission
      })
        .then((resp: any) => {
          return setIrohaSuccessResp(resp);      
        })
        .catch((err) => {
          return setIrohaErrorResp(err);          
        });
    };

    removePeer(removePeerRequest: RemovePeerRequest): Promise<any>{
      return this.commands.removePeer(this.COMMAND_OPTIONS, {
        publicKey: removePeerRequest.publicKey
      })
        .then((resp: any) => {
          return setIrohaSuccessResp(resp);      
        })
        .catch((err) => {
          return setIrohaErrorResp(err);          
        });
    };

    removeSignatory(removeSignatoryRequest: RemoveSignatoryRequest): Promise<any>{
      return this.commands.removeSignatory(this.COMMAND_OPTIONS, {
        accountId: removeSignatoryRequest.accountId,
        publicKey: removeSignatoryRequest.publicKey
      })
        .then((resp: any) => {
          return setIrohaSuccessResp(resp);      
        })
        .catch((err) => {
          return setIrohaErrorResp(err);          
        });
    };

    revokePermission(revokePermissionRequest: RevokePermissionRequest): Promise<any> {
      return this.commands.revokePermission(this.COMMAND_OPTIONS, {
        accountId: revokePermissionRequest.accountId,
        permission: revokePermissionRequest.permission
      })
        .then((resp: any) => {
          return setIrohaSuccessResp(resp);      
        })
        .catch((err) => {
          return setIrohaErrorResp(err);          
        });
    };

    setAccountDetail(setAccountDetailRequest: SetAccountDetailRequest): Promise<any>{
      return this.commands.setAccountDetail(this.COMMAND_OPTIONS, {
        accountId: setAccountDetailRequest.accountId,
        key: setAccountDetailRequest.key,
        value: setAccountDetailRequest.value
      })
        .then((resp: any) => {
          return setIrohaSuccessResp(resp);      
        })
        .catch((err) => {
          return setIrohaErrorResp(err);          
        });
    };
    
    setAccountQuorum(setAccountQuorumRequest: SetAccountQuorumRequest): Promise<any>{
      return this.commands.setAccountQuorum(this.COMMAND_OPTIONS, {
        accountId: setAccountQuorumRequest.accountId,
        quorum: setAccountQuorumRequest.quorum
      })
        .then((resp: any) => {
          return setIrohaSuccessResp(resp);      
        })
        .catch((err) => {
          return setIrohaErrorResp(err);          
        });
    };

    subtractAssetQuantity(subtractAssetQuantityRequest: AdjustAssetQuantityRequest): Promise<any>{
      return this.commands.subtractAssetQuantity(this.COMMAND_OPTIONS, {
        assetId: subtractAssetQuantityRequest.assetId,
        amount: subtractAssetQuantityRequest.amount
      })
        .then((resp: any) => {
          return setIrohaSuccessResp(resp);      
        })
        .catch((err) => {
          return setIrohaErrorResp(err);          
        });
    };

    transferAsset(transferAssetRequest: TransferAssetRequest): Promise<any>{
      return this.commands.transferAsset(this.COMMAND_OPTIONS, {
        srcAccountId: transferAssetRequest.srcAccountId,
        destAccountId: transferAssetRequest.destAccountId,
        assetId: transferAssetRequest.assetId,
        description: transferAssetRequest.description,
        amount: transferAssetRequest.amount
      })
        .then((resp: any) => {
          return setIrohaSuccessResp(resp);      
        })
        .catch((err) => {
          return setIrohaErrorResp(err);          
        });
    };

  }
  
  export = new CommandsController();