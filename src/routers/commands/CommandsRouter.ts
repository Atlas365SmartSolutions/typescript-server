import { NextFunction, Request, Response, Router } from 'express';
import { filter } from 'rxjs/operators'
//import CommandsController from '../../controllers/CommandsController';
import { AdjustAssetQuantityRequest, AddPeerRequest, AddSignatoryRequest, AppendRoleRequest, CompareAndSetAccountDetailRequest, CreateAccountRequest, CreateAssetRequest, CreateDomainRequest, CreateRoleRequest, DetachRoleRequest, GrantablePermissionRequest, RemovePeerRequest, RemoveSignatoryRequest, RevokePermissionRequest, SetAccountDetailRequest, SetAccountQuorumRequest, TransferAssetRequest } from '../../interfaces/iroha/CommandRequests';
import  cryptoHelper from 'iroha-helpers-ts/lib/cryptoHelper';
import { create } from 'domain';
import { GrantablePermission } from 'iroha-helpers-ts/lib/proto/primitive_pb';
import CommandsController = require('../../controllers/CommandsController');

class CommandsRouter {
  private _router = Router();
  private _controller = CommandsController;

  get router() {
    return this._router;
  }

  constructor() {
    
    //COMMANDS

    this._addAssetQuantity();
    this._addPeer();
    this._addSignatory();
    this._appendRole();
    this._compareAndSetAccountDetail();
    this._createAccount();
    this._createAsset();
    this._createDomain();
    this._createRole();
    this._detachRole();
    this._grantPermission();
    this._removePeer();
    this._removeSignatory();
    this._revokePermission();
    this._setAccountDetail();
    this._setAccountQuorum();
    this._subtractAssetQuantity();
    this._transferAsset();
  }

  /**
   * Connect routes to their matching controller endpoints.
   */
  private accountId = 'admin@test';
  private key = 'batch_0013_TEST';
  private assetId = 'coin#test' // NEED TO UPDATE ASSET ID
  private batchExtraction = {
    "bioMass": { "quantity": 3, "unit": "kg" },
    "crudeExtract": { "quantity": 330.05, "unit": "mg" },
    "unboundFiltrate": { "quantity": 46.94, "unit": "mg" },
    "finalElution": { "quantity": 164.61, "unit": "mg" },
    "unaccounted": { "quantity": 118.5, "unit": "mg" },
    "notes": [ "" ],
    "batchStatus": 'PENDING',
    "batchRequest": {
        "batchId": "batch_0013_TEST",
        "facilityAddress": "120",
        "facilityName": "COMPLETE",
        "signoffOfficer": [ "Cameron Parry", "Akeem Gardener", "Logan Morris" ],
        "batchCreationDate": "2020-10-27T14:25:00"
    }
  };
  private amount = '10';
  private address = 'localhost:50051';
  private peerKey = '';
  private publicKey = '';
  private roleName = 'admin-3';
  private value = '';
  private oldValue = '';
  private accountName = 'admin@test';
  private domainId = 'test';
  private assetName = 'canurta';
  private percision = 2;
  private defaultRole = 'user';
  private permissionList = [];
  private permission = '';
  private quorum = 2;
  private srcAccountId = 'admin';
  private destAccountId = 'admin-2';
  private description = 'Asset Transfer';

  // COMMANDS

  private async _addAssetQuantity() {
    this._router.post('/addAssetQuantity',  (req: Request, res: Response) => {
      let addAssetQuantityRequest = new AdjustAssetQuantityRequest;
      addAssetQuantityRequest = req.body;
      console.log("Incoming request for command *addAssetQuantity* ::: %s",addAssetQuantityRequest);
      
       this._controller.addAssetQuantity(addAssetQuantityRequest)
        .then(irohaResponse => {
          if (irohaResponse.status === 'COMMITTED') {
            res.status(200).json(irohaResponse);
          } else {
            res.status(500).json(irohaResponse);
          }
        });      
    });
  }
  //TODO:: FIX THIS COMMAND
  private async _addPeer() {
    this._router.post('/addPeer', (req: Request, res: Response, next: NextFunction) => {
      let addPeerRequest = new AddPeerRequest;
      let keyPair = cryptoHelper.generateKeyPair();
      addPeerRequest.address = req.body.address;
      addPeerRequest.peerKey = keyPair.publicKey;
      console.log("Incoming request for command *addPeer* ::: %s",addPeerRequest);

      this._controller.addPeer(addPeerRequest)
        .then(irohaResponse => {
          if (irohaResponse.status === 'COMMITTED') {
            res.status(200).json(irohaResponse);
          } else {
            res.status(500).json(irohaResponse);
          }
      });   
    });
  }
  //END TODO::

  //TODO:: FIX THIS COMMAND
  private async _addSignatory() {
    await this._router.post('/addSignatory', (req: Request, res: Response, next: NextFunction) => {
      let addSignatoryRequest = new AddSignatoryRequest;
      let keyPair = cryptoHelper.generateKeyPair();
      addSignatoryRequest.accountId = req.body.accountId;
      addSignatoryRequest.publicKey = keyPair.publicKey;
      console.log("Incoming request for command *addSignatory* ::: %s",addSignatoryRequest);


      this._controller.addSignatory(addSignatoryRequest)
        .then(irohaResponse => {
          if (irohaResponse.status === 'COMMITTED') {
            res.status(200).json(irohaResponse);
          } else {
            res.status(500).json(irohaResponse);
          }
      });

    });
  }
  //END TODO::

  private async _appendRole() {
    await this._router.post('/appendRole', (req: Request, res: Response, next: NextFunction) => {
      let appendRoleRequest = new AppendRoleRequest(req.body.accountId, req.body.roleName);
      appendRoleRequest = req.body;
      console.log("Incoming request for command *appendRole* ::: %s",appendRoleRequest);

      this._controller.appendRole(appendRoleRequest)
        .then(irohaResponse => {
          if (irohaResponse.status === 'COMMITTED') {
            res.status(200).json(irohaResponse);
          } else {
            res.status(500).json(irohaResponse);
          }
      });
    });
  }

  private async _compareAndSetAccountDetail() {
    await this._router.post('/compareAndSetAccountDetail', (req: Request, res: Response, next: NextFunction) => {
      let compareAndSetAccountDetailRequest = new CompareAndSetAccountDetailRequest;
      compareAndSetAccountDetailRequest = req.body;
      console.log("Incoming request for command *compareAndSetAccountDetail* ::: %s",compareAndSetAccountDetailRequest);

      this._controller.compareAndSetAccountDetail(compareAndSetAccountDetailRequest)
        .then(irohaResponse => {
          if (irohaResponse.status === 'COMMITTED') {
            res.status(200).json(irohaResponse);
          } else {
            res.status(500).json(irohaResponse);
          }
        });
    });
  }

  private async _createAccount() {
    await this._router.post('/createAccount', (req: Request, res: Response, next: NextFunction) => {
      let createAccountRequest = new CreateAccountRequest(req.body.accountId, this.domainId, req.body.publickey);
      createAccountRequest = req.body;
      console.log("Incoming request for command *createAccount* ::: %s",createAccountRequest);

      this._controller.createAccount(createAccountRequest)
        .then(irohaResponse => {
          if (irohaResponse.status === 'COMMITTED') {
            res.status(200).json(irohaResponse);
          } else {
            res.status(500).json(irohaResponse);
          }
      });
    });
  }

  private async _createAsset() {
    await this._router.post('/createAsset', (req: Request, res: Response, next: NextFunction) => {
      let createAssetRequest = new CreateAssetRequest(req.body.assetId,req.body.domainId,req.body.precision);
      createAssetRequest = req.body;
      console.log("Incoming request for command *createAsset* ::: %s",createAssetRequest);

      this._controller.createAsset(createAssetRequest)
        .then(irohaResponse => {
          if (irohaResponse.status === 'COMMITTED') {
            res.status(200).json(irohaResponse);
          } else {
            res.status(500).json(irohaResponse);
          }
      });
    });
  }

  private async _createDomain() {
    await this._router.post('/createDomain', (req: Request, res: Response, next: NextFunction) => {
      let createDomainRequest = new CreateDomainRequest(req.body.domainId,req.body.defaultRole);
      createDomainRequest = req.body;
      console.log("Incoming request for command *createDomain* ::: %s",createDomainRequest);

      this._controller.createDomain(createDomainRequest)
        .then(irohaResponse => {
          if (irohaResponse.status === 'COMMITTED') {
            res.status(200).json(irohaResponse);
          } else {
            res.status(500).json(irohaResponse);
          }
      });
    });
  }

  //TODO:: FIX THIS COMMAND
  private async _createRole() {
    await this._router.post('/createRole', (req: Request, res: Response, next: NextFunction) => {
      let createRoleRequest = new CreateRoleRequest;
      createRoleRequest = req.body;
      console.log("Incoming request for command *createRole* ::: %s",createRoleRequest);
      
      this._controller.createRole(createRoleRequest)
        .then(irohaResponse => {
          if (irohaResponse.status === 'COMMITTED') {
            res.status(200).json(irohaResponse);
          } else {
            res.status(500).json(irohaResponse);
          }
      });
    });
  }
  //END TODO::
  private async _detachRole() {
    await this._router.post('/detachRole', (req: Request, res: Response, next: NextFunction) => {
      let detachRoleRequest = new DetachRoleRequest;
      detachRoleRequest = req.body;
      console.log("Incoming request for command *detachRole* ::: %s",detachRoleRequest);

      this._controller.detachRole(detachRoleRequest)
        .then(irohaResponse => {
          if (irohaResponse.status === 'COMMITTED') {
            res.status(200).json(irohaResponse);
          } else {
            res.status(500).json(irohaResponse);
          }
      });
    });
  }

  //TODO:: FIX THIS COMMAND
  private async _grantPermission() {
    await this._router.post('/grantPermission', (req: Request, res: Response, next: NextFunction) => {
      let grantablePermissionRequest = new GrantablePermissionRequest;
      grantablePermissionRequest = req.body;
      console.log("Incoming request for command *grantPermission* ::: %s",grantablePermissionRequest);

      this._controller.grantPermission(grantablePermissionRequest)
        .then(irohaResponse => {
          if (irohaResponse.status === 'COMMITTED') {
            res.status(200).json(irohaResponse);
          } else {
            res.status(500).json(irohaResponse);
          }
      });
    });
  }
  //END TODO::

  private async _removePeer() {
    await this._router.post('/removePeer', (req: Request, res: Response, next: NextFunction) => {
      let removePeerRequest = new RemovePeerRequest;
      removePeerRequest = req.body;
      console.log("Incoming request for command *removePeer* ::: %s",removePeerRequest);

      this._controller.removePeer(removePeerRequest)
        .then(irohaResponse => {
          if (irohaResponse.status === 'COMMITTED') {
            res.status(200).json(irohaResponse);
          } else {
            res.status(500).json(irohaResponse);
          }
      });        
    });
  }

  private async _removeSignatory() {
    await this._router.post('/removeSignatory', (req: Request, res: Response, next: NextFunction) => {
      let removeSignatoryRequest = new RemoveSignatoryRequest;
      removeSignatoryRequest = req.body;
      console.log("Incoming request for command *removeSignatory* ::: %s",removeSignatoryRequest);

      this._controller.removeSignatory(removeSignatoryRequest)
        .then(irohaResponse => {
          if (irohaResponse.status === 'COMMITTED') {
            res.status(200).json(irohaResponse);
          } else {
            res.status(500).json(irohaResponse);
          }
      });      
    });
  }

  private async _revokePermission() {
    await this._router.post('/revokePermission', (req: Request, res: Response, next: NextFunction) => {
      let revokePermissionRequest = new RevokePermissionRequest;
      revokePermissionRequest = req.body;
      console.log("Incoming request for command *revokePermission* ::: %s",revokePermissionRequest);

      this._controller.revokePermission(revokePermissionRequest)
        .then(irohaResponse => {
          if (irohaResponse.status === 'COMMITTED') {
            res.status(200).json(irohaResponse);
          } else {
            res.status(500).json(irohaResponse);
          }
      });  
    });
  }

  private async _setAccountDetail() {
    await this._router.post('/setAccountDetail', (req: Request, res: Response, next: NextFunction) => {
      let setAccountDetailRequest = new SetAccountDetailRequest;
      setAccountDetailRequest = req.body;
      console.log("Incoming request for command *setAccountDetail* ::: %s",setAccountDetailRequest);

      this._controller.setAccountDetail(setAccountDetailRequest)
        .then(irohaResponse => {
          if (irohaResponse.status === 'COMMITTED') {
            res.status(200).json(irohaResponse);
          } else {
            res.status(500).json(irohaResponse);
          }
      });  
    });
  }

  private async _setAccountQuorum() {
    await this._router.post('/setAccountQuorum', (req: Request, res: Response, next: NextFunction) => {
      let setAccountQuorumRequest = new SetAccountQuorumRequest;
      setAccountQuorumRequest = req.body;
      console.log("Incoming request for command *setAccountQuorum* ::: %s",setAccountQuorumRequest);

      this._controller.setAccountQuorum(setAccountQuorumRequest)
        .then(irohaResponse => {
          if (irohaResponse.status === 'COMMITTED') {
            res.status(200).json(irohaResponse);
          } else {
            res.status(500).json(irohaResponse);
          }
      });  
    });
  }

  private async _subtractAssetQuantity() {
    this._router.post('/subtractAssetQuantity',  (req: Request, res: Response, next: NextFunction) => {
      let subtractAssetQuantityRequest = new AdjustAssetQuantityRequest;
      subtractAssetQuantityRequest = req.body;
      console.log("Incoming request for command *subtractAssetQuantity* ::: %s",subtractAssetQuantityRequest);
      
       this._controller.subtractAssetQuantity(subtractAssetQuantityRequest)
        .then(irohaResponse => {
          if (irohaResponse.status === 'COMMITTED') {
            res.status(200).json(irohaResponse);
          } else {
            res.status(500).json(irohaResponse);
          }
        });      
    });
  }

  private async _transferAsset() {
    await this._router.post('/transferAsset', (req: Request, res: Response, next: NextFunction) => {
      let transferAssetRequest = new TransferAssetRequest;
      transferAssetRequest = req.body;
      console.log("Incoming request for command *transferAsset* ::: %s",transferAssetRequest);
      
      this._controller.transferAsset(transferAssetRequest)
        .then(irohaResponse => {
          if (irohaResponse.status === 'COMMITTED') {
            res.status(200).json(irohaResponse);
          } else {
            res.status(500).json(irohaResponse);
          }
        });  
    });
  }
}

export = new CommandsRouter().router;