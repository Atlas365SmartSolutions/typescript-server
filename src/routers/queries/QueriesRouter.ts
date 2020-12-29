import { NextFunction, Request, response, Response, Router } from 'express';
import { BehaviorSubject, Subscription } from 'rxjs';
import { filter } from 'rxjs/operators'
import QueriesController from '../../controllers/QueriesController';

class QueriesRouter {
  private _router = Router();
  private _controller = QueriesController;

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
  }

  /**
   * Connect routes to their matching controller endpoints.
   */
  private accountId = 'admin@test';
  private key = 'batch_0013_TEST';
  private assetId = 'coin#test' // NEED TO UPDATE ASSET ID
  private firstTxHash  = '56a4a8ae9b6bc36aa2d47b7bd5027764c6b3cca0901983ece921daac9a1748c9';
  private txHash = 19900111;
  private height = 1;
  private roleId = 'user';
  private txHashesList = ['b75dad43c2a6f8c137678a4941aac0a56c6c0ec7a920feebfa183a0290761c83'];

  // QUERIES

  private async _getAccount() { 
    await this._router.get('/getAccount', (req: Request, res: Response, next: NextFunction) => {
      var callBackflag = false;
       this._controller.getAccount(this.accountId)
       this._controller.getAccount$.pipe(filter(response => !!response && !callBackflag)).subscribe(response => {
        callBackflag = true;
        !!response.response 
        ? res.status(200).json(response.response)
        : res.status(500).json(response.error); 
      });
    });

    // this.sub.unsubscribe();
  }

  private async _getAccountTransactions() {
    await this._router.get('/getAccountTransactions', (req: Request, res: Response, next: NextFunction) => {
      var callBackflag = false;
      this._controller.getAccountTransactions(this.accountId);
      this._controller.getAccountTransactions$.pipe(filter(response => !!response && !callBackflag)).subscribe(response => {
        callBackflag = true;
        !!response.response
        ? res.status(200).json(response.response)
        : res.status(500).json(response.error);
      });
    });
  }

  private async _getAccountAssets() {
    await this._router.get('/getAccountAssets', (req: Request, res: Response, next: NextFunction) => {
      var callBackflag = false;
      this._controller.getAccountAssets(this.accountId, this.assetId);
      this._controller.getAccountAssets$.pipe(filter(response => !!response && !callBackflag)).subscribe(response => {
        callBackflag = true;
        !!response.response
        ? res.status(200).json(response.response)
        : res.status(500).json(response.error);
      });
    });
  }

  private async _getAccountDetail() {
    await this._router.get('/getAccountDetail', (req: Request, res: Response, next: NextFunction) => {
      var callBackflag = false;
      this._controller.getAccountDetail(this.accountId, this.key);
      this._controller.getAccountDetail$.pipe(filter(response => !!response && !callBackflag)).subscribe(response => {
        callBackflag = true;
        !!response.response
        ? res.status(200).json(response.response)
        : res.status(500).json(response.error);
      });
    });
  }

  // NEED TO SET UP ASSETS TO TEST
  private async _getAccountAssetTransactions() {
    await this._router.get('/getAccountAssetTransactions', (req: Request, res: Response, next: NextFunction) => {
      var callBackflag = false;
      this._controller.getAccountAssetTransactions(this.accountId, this.assetId, this.firstTxHash);
      this._controller.getAccountAssetTransactions$.pipe(filter(response => !!response && !callBackflag)).subscribe(response => {
        callBackflag = true;
        !!response.response
        ? res.status(200).json(response.response)
        : res.status(500).json(response.error);
      });
    });
  }

  private async _getAssetInfo() {
    await this._router.get('/getAssetInfo', (req: Request, res: Response, next: NextFunction) => {
      var callBackflag = false;
      this._controller.getAssetInfo(this.assetId);
      this._controller.getAssetInfo$.pipe(filter(response => !!response && !callBackflag)).subscribe(response => {
        callBackflag = true;
        !!response.response
        ? res.status(200).json(response.response)
        : res.status(500).json(response.error);
      });
    });
  }

  private async _getBlock() {
    await this._router.get('/getBlock', (req: Request, res: Response, next: NextFunction) => {
      var callBackflag = false;
      this._controller.getBlock(this.height);
      this._controller.getBlock$.pipe(filter(response => !!response && !callBackflag)).subscribe(response => {
        callBackflag = true;
        !!response.response
        ? res.status(200).json(response.response)
        : res.status(500).json(response.error);
      });
    });
  }

  private async _getEngineReceipts() {
    await this._router.get('/getEngineReceipts', (req: Request, res: Response, next: NextFunction) => {
      var callBackflag = false;
      this._controller.getEngineReceipts(this.txHash);
      this._controller.getEngineReceipts$.pipe(filter(response => !!response && !callBackflag)).subscribe(response => {
        callBackflag = true;
        !!response.response
        ? res.status(200).json(response.response)
        : res.status(500).json(response.error);
      });
    });
  }

  private async _getPeers() {
    await this._router.get('/getPeers', (req: Request, res: Response, next: NextFunction) => {
      var callBackflag = false;
      this._controller.getPeers();
      this._controller.getPeers$.pipe(filter(response => !!response && !callBackflag)).subscribe(response => {
        callBackflag = true;
        !!response.response
        ? res.status(200).json(response.response)
        : res.status(500).json(response.error);
      });
    });
  }

  private async _getPendingTransactions() {
    await this._router.get('/getPendingTransactions', (req: Request, res: Response, next: NextFunction) => {
      var callBackflag = false;
      this._controller.getPendingTransactions(this.firstTxHash);
      this._controller.getPendingTransactions$.pipe(filter(response => !!response && !callBackflag)).subscribe(response => {
        callBackflag = true;
        !!response.response
        ? res.status(200).json(response.response)
        : res.status(500).json(response.error);
      });
    });
  }

  private async _getRawAccount() {
    await this._router.get('/getRawAccount', (req: Request, res: Response, next: NextFunction) => {
      var callBackflag = false;
      this._controller.getRawAccount(this.accountId);
      this._controller.getRawAccount$.pipe(filter(response => !!response && !callBackflag)).subscribe(response => {
        callBackflag = true;
        !!response.response
        ? res.status(200).json(response.response)
        : res.status(500).json(response.error);
      });
    });
  }

  private async _getRawPendingTransactions() {
    await this._router.get('/getRawPendingTransactions', (req: Request, res: Response, next: NextFunction) => {
      var callBackflag = false;
      this._controller.getRawPendingTransactions();
      this._controller.getRawPendingTransactions$.pipe(filter(response => !!response && !callBackflag)).subscribe(response => {
        callBackflag = true;
        !!response.response
        ? res.status(200).json(response.response)
        : res.status(500).json(response.error);
      });
    });
  }

  private async _getRolePermissions() {
    await this._router.get('/getRolePermissions', (req: Request, res: Response, next: NextFunction) => {
      var callBackflag = false;
      this._controller.getRolePermissions(this.roleId);
      this._controller.getRolePermissions$.pipe(filter(response => !!response && !callBackflag)).subscribe(response => {
        callBackflag = true;
        !!response.response
        ? res.status(200).json(response.response)
        : res.status(500).json(response.error);
      });
    });
  }

  private async _getRoles() {
    await this._router.get('/getRoles', (req: Request, res: Response, next: NextFunction) => {
      var callBackflag = false;
      this._controller.getRoles();
      this._controller.getRoles$.pipe(filter(response => !!response && !callBackflag)).subscribe(response => {
        callBackflag = true;
        !!response.response
        ? res.status(200).json(response.response)
        : res.status(500).json(response.error);
      });
    });
  }

  private async _getSignatories() {
    await this._router.get('/getSignatories', (req: Request, res: Response, next: NextFunction) => {
      var callBackflag = false;
      this._controller.getSignatories(this.accountId);
      this._controller.getSignatories$.pipe(filter(response => !!response && !callBackflag)).subscribe(response => {
        callBackflag = true;
        !!response.response
        ? res.status(200).json(response.response)
        : res.status(500).json(response.error);
      });
    });
  }

  private async _getTransactions() {
    await this._router.get('/getTransactions', (req: Request, res: Response, next: NextFunction) => {
      var callBackflag = false;
      this._controller.getTransactions(this.txHashesList);
      this._controller.getTransactions$.pipe(filter(response => !!response && !callBackflag)).subscribe(response => {
        callBackflag = true;
        !!response.response
        ? res.status(200).json(response.response)
        : res.status(500).json(response.error);
      });
    });
  }
}

export = new QueriesRouter().router;