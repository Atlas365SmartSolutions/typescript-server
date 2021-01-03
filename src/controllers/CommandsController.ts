import grpc from 'grpc';
import {
    CommandService_v1Client as CommandService
  } from 'iroha-helpers-ts/lib/proto/endpoint_grpc_pb';
import commandsInit from 'iroha-helpers-ts/lib/commands/index';
import { setIrohaErrorResp, setIrohaSuccessResp } from '../utils/utils';
import { AdjustAssetQuantityRequest, AddPeerRequest, AddSignatoryRequest, AppendRoleRequest, CompareAndSetAccountDetailRequest, CreateAccountRequest, CreateAssetRequest, CreateDomainRequest, CreateRoleRequest, DetachRoleRequest, GrantablePermissionRequest, RemovePeerRequest, RemoveSignatoryRequest, RevokePermissionRequest, SetAccountDetailRequest, SetAccountQuorumRequest, TransferAssetRequest } from '../interfaces/iroha/CommandRequests';


class CommandsController {

    // COMMANDS    
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
    addAssetQuantity(addAssetQuantityRequest: AdjustAssetQuantityRequest): Promise<any> {
      return this.commands.addAssetQuantity(this.COMMAND_OPTIONS, addAssetQuantityRequest)
        .then((resp: any) => {
          return setIrohaSuccessResp(resp);      
        })
        .catch((err) => {
          return setIrohaErrorResp(err);          
        });
    };
    //TODO:: FIX THIS COMMAND
    addPeer(addPeerRequest: AddPeerRequest): Promise<any>{
      return this.commands.addPeer(this.COMMAND_OPTIONS, addPeerRequest)
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
      return this.commands.addSignatory(this.COMMAND_OPTIONS,addSignatoryRequest)
        .then((resp: any) => {
          return setIrohaSuccessResp(resp);      
        })
        .catch((err) => {
          return setIrohaErrorResp(err);          
        });
    };
    //END TODO

    appendRole(appendRoleRequest: AppendRoleRequest): Promise<any> {
      return this.commands.appendRole(this.COMMAND_OPTIONS,appendRoleRequest)
        .then((resp: any) => {
          return setIrohaSuccessResp(resp);      
        })
        .catch((err) => {
          return setIrohaErrorResp(err);          
        });
    };

    compareAndSetAccountDetail(compareAndSetAccountDetailRequest: CompareAndSetAccountDetailRequest): Promise<any>{
      return this.commands.compareAndSetAccountDetail(this.COMMAND_OPTIONS, compareAndSetAccountDetailRequest)
        .then((resp: any) => {
          return setIrohaSuccessResp(resp);      
        })
        .catch((err) => {
          return setIrohaErrorResp(err);          
        });
    };

    createAccount(createAccountRequest: CreateAccountRequest): Promise<any> {
      return this.commands.createAccount(this.COMMAND_OPTIONS, createAccountRequest)
        .then((resp: any) => {
          return setIrohaSuccessResp(resp);      
        })
        .catch((err) => {
          return setIrohaErrorResp(err);          
        });
    };

    createAsset(createAssetRequest: CreateAssetRequest): Promise<any>{
      return this.commands.createAsset(this.COMMAND_OPTIONS, createAssetRequest)
        .then((resp: any) => {
          return setIrohaSuccessResp(resp);      
        })
        .catch((err) => {
          return setIrohaErrorResp(err);          
        });
    };

    createDomain(createDomainRequest: CreateDomainRequest): Promise<any>{
      return this.commands.createDomain(this.COMMAND_OPTIONS, createDomainRequest)
        .then((resp: any) => {
          return setIrohaSuccessResp(resp);      
        })
        .catch((err) => {
          return setIrohaErrorResp(err);          
        });
    };

    createRole(createRoleRequest: CreateRoleRequest): Promise<any>{
      return this.commands.createRole(this.COMMAND_OPTIONS, createRoleRequest)
        .then((resp: any) => {
          return setIrohaSuccessResp(resp);      
        })
        .catch((err) => {
          return setIrohaErrorResp(err);          
        });
    };

    detachRole(detachRoleRequest: DetachRoleRequest): Promise<any>{
      return this.commands.detachRole(this.COMMAND_OPTIONS, detachRoleRequest)
        .then((resp: any) => {
          return setIrohaSuccessResp(resp);      
        })
        .catch((err) => {
          return setIrohaErrorResp(err);          
        });
    };

    grantPermission(grantablePermissionRequest: GrantablePermissionRequest){
      return this.commands.grantPermission(this.COMMAND_OPTIONS, grantablePermissionRequest)
        .then((resp: any) => {
          return setIrohaSuccessResp(resp);      
        })
        .catch((err) => {
          return setIrohaErrorResp(err);          
        });
    };

    removePeer(removePeerRequest: RemovePeerRequest): Promise<any>{
      return this.commands.removePeer(this.COMMAND_OPTIONS, removePeerRequest)
        .then((resp: any) => {
          return setIrohaSuccessResp(resp);      
        })
        .catch((err) => {
          return setIrohaErrorResp(err);          
        });
    };

    removeSignatory(removeSignatoryRequest: RemoveSignatoryRequest): Promise<any>{
      return this.commands.removeSignatory(this.COMMAND_OPTIONS, removeSignatoryRequest)
        .then((resp: any) => {
          return setIrohaSuccessResp(resp);      
        })
        .catch((err) => {
          return setIrohaErrorResp(err);          
        });
    };

    revokePermission(revokePermissionRequest: RevokePermissionRequest): Promise<any> {
      return this.commands.revokePermission(this.COMMAND_OPTIONS, revokePermissionRequest)
        .then((resp: any) => {
          return setIrohaSuccessResp(resp);      
        })
        .catch((err) => {
          return setIrohaErrorResp(err);          
        });
    };

    setAccountDetail(setAccountDetailRequest: SetAccountDetailRequest): Promise<any>{
      return this.commands.setAccountDetail(this.COMMAND_OPTIONS,setAccountDetailRequest)
        .then((resp: any) => {
          return setIrohaSuccessResp(resp);      
        })
        .catch((err) => {
          return setIrohaErrorResp(err);          
        });
    };
    
    setAccountQuorum(setAccountQuorumRequest: SetAccountQuorumRequest): Promise<any>{
      return this.commands.setAccountQuorum(this.COMMAND_OPTIONS,setAccountQuorumRequest)
        .then((resp: any) => {
          return setIrohaSuccessResp(resp);      
        })
        .catch((err) => {
          return setIrohaErrorResp(err);          
        });
    };

    subtractAssetQuantity(subtractAssetQuantityRequest: AdjustAssetQuantityRequest): Promise<any>{
      return this.commands.subtractAssetQuantity(this.COMMAND_OPTIONS,subtractAssetQuantityRequest)
        .then((resp: any) => {
          return setIrohaSuccessResp(resp);      
        })
        .catch((err) => {
          return setIrohaErrorResp(err);          
        });
    };

    transferAsset(transferAssetRequest: TransferAssetRequest): Promise<any>{
      return this.commands.transferAsset(this.COMMAND_OPTIONS,transferAssetRequest)
        .then((resp: any) => {
          return setIrohaSuccessResp(resp);      
        })
        .catch((err) => {
          return setIrohaErrorResp(err);          
        });
    };

  }
  
  export = new CommandsController();