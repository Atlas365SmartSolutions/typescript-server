import { NextFunction, Request, Response, Router } from 'express';
import { filter } from 'rxjs/operators'
import CommandsController from '../../controllers/CommandsController';

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
  private assetId = 'canurta@atlas' // NEED TO UPDATE ASSET ID
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
  private amount = 10;
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
    await this._router.post('/addAssetQuantity', (req: Request, res: Response, next: NextFunction) => {
      this._controller.addAssetQuantity(this.accountId, this.amount);
      this._controller.addAssetQuantity$.pipe(filter(response => !!response)).subscribe(response => {
        !!response.response
        ? res.status(200).json(response.response)
        : res.status(500).json(response.error);
      });
    });
  }

  private async _addPeer() {
    await this._router.post('/addPeer', (req: Request, res: Response, next: NextFunction) => {
      this._controller.addPeer(this.address, this.peerKey);
      this._controller.addPeer$.pipe(filter(response => !!response)).subscribe(response => {
        !!response.response
        ? res.status(200).json(response.response)
        : res.status(500).json(response.error);
      });
    });
  }

  private async _addSignatory() {
    await this._router.post('/addSignatory', (req: Request, res: Response, next: NextFunction) => {
      this._controller.addSignatory(this.address, this.publicKey);
      this._controller.addSignatory$.pipe(filter(response => !!response)).subscribe(response => {
        !!response.response
        ? res.status(200).json(response.response)
        : res.status(500).json(response.error);
      });
    });
  }

  private async _appendRole() {
    await this._router.post('/appendRole', (req: Request, res: Response, next: NextFunction) => {
      this._controller.appendRole(this.accountId, this.roleName);
      this._controller.appendRole$.pipe(filter(response => !!response)).subscribe(response => {
        !!response.response
        ? res.status(200).json(response.response)
        : res.status(500).json(response.error);
      });
    });
  }

  private async _compareAndSetAccountDetail() {
    await this._router.post('/compareAndSetAccountDetail', (req: Request, res: Response, next: NextFunction) => {
      this._controller.compareAndSetAccountDetail(this.accountId,this.key, this.value, this.oldValue);
      this._controller.compareAndSetAccountDetail$.pipe(filter(response => !!response)).subscribe(response => {
        !!response.response
        ? res.status(200).json(response.response)
        : res.status(500).json(response.error);
      });
    });
  }

  private async _createAccount() {
    await this._router.post('/createAccount', (req: Request, res: Response, next: NextFunction) => {
      this._controller.createAccount(this.accountName, this.domainId, this.publicKey);
      this._controller.createAccount$.pipe(filter(response => !!response)).subscribe(response => {
        !!response.response
        ? res.status(200).json(response.response)
        : res.status(500).json(response.error);
      });
    });
  }

  private async _createAsset() {
  await this._router.post('/createAsset', (req: Request, res: Response, next: NextFunction) => {
      this._controller.createAsset(this.assetName, this.domainId, this.percision);
      this._controller.createAsset$.pipe(filter(response => !!response)).subscribe(response => {
        !!response.response
        ? res.status(200).json(response.response)
        : res.status(500).json(response.error);
      });
    });
  }

  private async _createDomain() {
    await this._router.post('/createDomain', (req: Request, res: Response, next: NextFunction) => {
      this._controller.createDomain(this.domainId, this.defaultRole);
      this._controller.createDomain$.pipe(filter(response => !!response)).subscribe(response => {
        !!response.response
        ? res.status(200).json(response.response)
        : res.status(500).json(response.error);
      });
    });
  }

  private async _createRole() {
    await this._router.post('/createRole', (req: Request, res: Response, next: NextFunction) => {
      this._controller.createRole(this.roleName, this.permissionList);
      this._controller.createRole$.pipe(filter(response => !!response)).subscribe(response => {
        !!response.response
        ? res.status(200).json(response.response)
        : res.status(500).json(response.error);
      });
    });
  }

  private async _detachRole() {
    await this._router.post('/detachRole', (req: Request, res: Response, next: NextFunction) => {
      this._controller.detachRole(this.accountId, this.roleName);
      this._controller.detachRole$.pipe(filter(response => !!response)).subscribe(response => {
        !!response.response
        ? res.status(200).json(response.response)
        : res.status(500).json(response.error);
      });
    });
  }

  private async _grantPermission() {
    await this._router.post('/grantPermission', (req: Request, res: Response, next: NextFunction) => {
      this._controller.grantPermission(this.accountId, this.permission);
      this._controller.grantPermission$.pipe(filter(response => !!response)).subscribe(response => {
        !!response.response
        ? res.status(200).json(response.response)
        : res.status(500).json(response.error);
      });
    });
  }

  private async _removePeer() {
  await this._router.post('/removePeer', (req: Request, res: Response, next: NextFunction) => {
      this._controller.removePeer(this.publicKey);
      this._controller.removePeer$.pipe(filter(response => !!response)).subscribe(response => {
        !!response.response
        ? res.status(200).json(response.response)
        : res.status(500).json(response.error);
      });
    });
  }

  private async _removeSignatory() {
    await this._router.post('/removeSignatory', (req: Request, res: Response, next: NextFunction) => {
      this._controller.removeSignatory(this.accountId, this.publicKey);
      this._controller.removeSignatory$.pipe(filter(response => !!response)).subscribe(response => {
        !!response.response
        ? res.status(200).json(response.response)
        : res.status(500).json(response.error);
      });
    });
  }

  private async _revokePermission() {
    await this._router.post('/revokePermission', (req: Request, res: Response, next: NextFunction) => {
      this._controller.revokePermission(this.accountId, this.permission);
      this._controller.revokePermission$.pipe(filter(response => !!response)).subscribe(response => {
        !!response.response
        ? res.status(200).json(response.response)
        : res.status(500).json(response.error);
      });
    });
  }

  private async _setAccountDetail() {
    await this._router.post('/setAccountDetail', (req: Request, res: Response, next: NextFunction) => {
      this._controller.setAccountDetail(this.accountId, this.batchExtraction);
      this._controller.setAccountDetail$.pipe(filter(response => !!response)).subscribe(response => {
        !!response.response
        ? res.status(200).json(response.response)
        : res.status(500).json(response.error);
      });
    });
  }

  private async _setAccountQuorum() {
    await this._router.post('/setAccountQuorum', (req: Request, res: Response, next: NextFunction) => {
      this._controller.setAccountQuorum(this.accountId, this.quorum);
      this._controller.setAccountQuorum$.pipe(filter(response => !!response)).subscribe(response => {
        !!response.response
        ? res.status(200).json(response.response)
        : res.status(500).json(response.error);
      });
    });
  }

  private async _subtractAssetQuantity() {
    await this._router.post('/subtractAssetQuantity', (req: Request, res: Response, next: NextFunction) => {
      this._controller.subtractAssetQuantity(this.assetId, this.amount);
      this._controller.subtractAssetQuantity$.pipe(filter(response => !!response)).subscribe(response => {
        !!response.response
        ? res.status(200).json(response.response)
        : res.status(500).json(response.error);
      });
    });
  }

  private async _transferAsset() {
    await this._router.post('/transferAsset', (req: Request, res: Response, next: NextFunction) => {
      this._controller.transferAsset(this.srcAccountId, this.destAccountId, this.assetId, this.description, this.amount);
      this._controller.transferAsset$.pipe(filter(response => !!response)).subscribe(response => {
        !!response.response
        ? res.status(200).json(response.response)
        : res.status(500).json(response.error);
      });
    });
  }
}

export = new CommandsRouter().router;