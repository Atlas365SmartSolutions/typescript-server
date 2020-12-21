import { NextFunction, Request, Response, Router } from 'express';
import { filter } from 'rxjs/operators'
import ThemeAController from '../../controllers/ThemeAController';

class ThemeARouter {
  private _router = Router();
  private _controller = ThemeAController;

  get router() {
    return this._router;
  }

  constructor() {
    //QUERIES

    this._getAccount();
    this._getAccountTransactions();
    this._getAccountDetail();
    this._getAccountAssets();
    this._getAccountAssetTransactions();
    this._getAssetInfo();
    this._getBlock();
    this._getEngineReceipts();
    this._getPeers();
    this._getPendingTransactions();
    this._getRawAccount();
    this._getRawPendingTransactions();
    this._getRolePermissions();
    this._getRoles();
    this._getSignatories();
    this._getTransactions();

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
  private respBatchSearchKey = 'batch_0001';
  private assetId = 'canurta@atlas' // NEED TO UPDATE ASSET ID
  private firstTxHash  ='';
  private txHash = 19900111;
  private height = 100;
  private roleId = 12345;
  private txHashesList = [''];
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

  // QUERIES

  private async _getAccount() {
    await this._router.get('/getAccount', (req: Request, res: Response, next: NextFunction) => {
      this._controller.getAccount(this.accountId);
      this._controller.getAccount$.pipe(filter(response => !!response)).subscribe(response => {
        !!response.response
        ? res.status(200).json(response.response)
        : res.status(500).json(response.error);
      });
    });
  }

  private async _getAccountTransactions() {
    await this._router.get('/getAccountTransactions', (req: Request, res: Response, next: NextFunction) => {
      this._controller.getAccountTransactions(this.accountId);
      this._controller.getAccountTransactions$.pipe(filter(response => !!response)).subscribe(response => {
        !!response.response
        ? res.status(200).json(response.response)
        : res.status(500).json(response.error);
      });
    });
  }

  private async _getAccountAssets() {
    await this._router.get('/getAccountAssets', (req: Request, res: Response, next: NextFunction) => {
      this._controller.getAccountAssets(this.accountId, this.assetId);
      this._controller.getAccountAssets$.pipe(filter(response => !!response)).subscribe(response => {
        !!response.response
        ? res.status(200).json(response.response)
        : res.status(500).json(response.error);
      });
    });
  }

  private async _getAccountDetail() {
    await this._router.get('/getAccountDetail', (req: Request, res: Response, next: NextFunction) => {
      this._controller.getAccountDetail(this.accountId, this.key);
      this._controller.getAccountDetail$.pipe(filter(response => !!response)).subscribe(response => {
        !!response.response
        ? res.status(200).json(response.response)
        : res.status(500).json(response.error);
      });
    });
  }

  private async _getAccountAssetTransactions() {
    await this._router.get('/getAccountAssetTransactions', (req: Request, res: Response, next: NextFunction) => {
      this._controller.getAccountAssetTransactions(this.accountId, this.assetId, this.firstTxHash);
      this._controller.getAccountAssetTransactions$.pipe(filter(response => !!response)).subscribe(response => {
        !!response.response
        ? res.status(200).json(response.response)
        : res.status(500).json(response.error);
      });
    });
  }

  private async _getAssetInfo() {
    await this._router.get('/getAssetInfo', (req: Request, res: Response, next: NextFunction) => {
      this._controller.getAssetInfo(this.assetId);
      this._controller.getAssetInfo$.pipe(filter(response => !!response)).subscribe(response => {
        !!response.response
        ? res.status(200).json(response.response)
        : res.status(500).json(response.error);
      });
    });
  }

  private async _getBlock() {
    await this._router.get('/getBlock', (req: Request, res: Response, next: NextFunction) => {
      this._controller.getBlock(this.height);
      this._controller.getBlock$.pipe(filter(response => !!response)).subscribe(response => {
        !!response.response
        ? res.status(200).json(response.response)
        : res.status(500).json(response.error);
      });
    });
  }

  private async _getEngineReceipts() {
    await this._router.get('/getEngineReceipts', (req: Request, res: Response, next: NextFunction) => {
      this._controller.getEngineReceipts(this.txHash);
      this._controller.getEngineReceipts$.pipe(filter(response => !!response)).subscribe(response => {
        !!response.response
        ? res.status(200).json(response.response)
        : res.status(500).json(response.error);
      });
    });
  }

  private async _getPeers() {
    await this._router.get('/getPeer', (req: Request, res: Response, next: NextFunction) => {
      this._controller.getPeers();
      this._controller.getPeers$.pipe(filter(response => !!response)).subscribe(response => {
        !!response.response
        ? res.status(200).json(response.response)
        : res.status(500).json(response.error);
      });
    });
  }

  private async _getPendingTransactions() {
    await this._router.get('/getPendingTransactions', (req: Request, res: Response, next: NextFunction) => {
      this._controller.getPendingTransactions(this.firstTxHash);
      this._controller.getPendingTransactions$.pipe(filter(response => !!response)).subscribe(response => {
        !!response.response
        ? res.status(200).json(response.response)
        : res.status(500).json(response.error);
      });
    });
  }

  private async _getRawAccount() {
    await this._router.get('/getRawAccount', (req: Request, res: Response, next: NextFunction) => {
      this._controller.getRawAccount(this.accountId);
      this._controller.getRawAccount$.pipe(filter(response => !!response)).subscribe(response => {
        !!response.response
        ? res.status(200).json(response.response)
        : res.status(500).json(response.error);
      });
    });
  }

  private async _getRawPendingTransactions() {
    await this._router.get('/getRawPendingTransactions', (req: Request, res: Response, next: NextFunction) => {
      this._controller.getRawPendingTransactions();
      this._controller.getRawPendingTransactions$.pipe(filter(response => !!response)).subscribe(response => {
        !!response.response
        ? res.status(200).json(response.response)
        : res.status(500).json(response.error);
      });
    });
  }

  private async _getRolePermissions() {
    await this._router.get('/getRolePermissions', (req: Request, res: Response, next: NextFunction) => {
      this._controller.getRolePermissions(this.roleId);
      this._controller.getRolePermissions$.pipe(filter(response => !!response)).subscribe(response => {
        !!response.response
        ? res.status(200).json(response.response)
        : res.status(500).json(response.error);
      });
    });
  }

  private async _getRoles() {
    await this._router.get('/getRoles', (req: Request, res: Response, next: NextFunction) => {
      this._controller.getRoles();
      this._controller.getRoles$.pipe(filter(response => !!response)).subscribe(response => {
        !!response.response
        ? res.status(200).json(response.response)
        : res.status(500).json(response.error);
      });
    });
  }

  private async _getSignatories() {
    await this._router.get('/getSignatories', (req: Request, res: Response, next: NextFunction) => {
      this._controller.getSignatories(this.accountId);
      this._controller.getSignatories$.pipe(filter(response => !!response)).subscribe(response => {
        !!response.response
        ? res.status(200).json(response.response)
        : res.status(500).json(response.error);
      });
    });
  }

  private async _getTransactions() {
    await this._router.get('/getTransactions', (req: Request, res: Response, next: NextFunction) => {
      this._controller.getTransactions(this.txHashesList);
      this._controller.getTransactions$.pipe(filter(response => !!response)).subscribe(response => {
        !!response.response
        ? res.status(200).json(response.response)
        : res.status(500).json(response.error);
      });
    });
  }
}

export = new ThemeARouter().router;