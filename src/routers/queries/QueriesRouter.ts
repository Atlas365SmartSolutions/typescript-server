import { NextFunction, Request, response, Response, Router } from 'express';
import QueriesController from '../../controllers/QueriesController';
import *  as QueryRequests from '../../interfaces/iroha/QueryRequests';

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
    await this._router.post('/getAccount', (req: Request, res: Response, next: NextFunction) => {
      let getAccountRequest = new QueryRequests.GetAccountRequest;
      getAccountRequest = req.body;
      console.log("Incoming request for query *getAccount* ::: %s",getAccountRequest);

      this._controller.getAccount(getAccountRequest)
        .then(irohaResponse => {
          if(irohaResponse.accountId) {
            res.status(200).json(irohaResponse);
          } else {
            res.status(500).json(irohaResponse);
          }
        });            
    });
  }

  private async _getAccountTransactions() {
    await this._router.post('/getAccountTransactions', (req: Request, res: Response, next: NextFunction) => {
      let getAccountTxRequest = new QueryRequests.GetAccountTransactionsRequest;
      getAccountTxRequest = req.body;
      console.log("Incoming request for query *getAccountTransactions* ::: %s",getAccountTxRequest);

      this._controller.getAccountTransactions(getAccountTxRequest)
        .then(irohaResponse => {
          if(irohaResponse.transactionsList) {
            res.status(200).json(irohaResponse);
          } else {
            res.status(500).json(irohaResponse);
          }
        });
     
    });
  }

  private async _getAccountAssets() {
    await this._router.post('/getAccountAssets', (req: Request, res: Response, next: NextFunction) => {
      let getAccountAssetsRequest = new QueryRequests.GetAccountAssetsRequest;
      getAccountAssetsRequest = req.body;
      console.log("Incoming request for query *getAccountAssets* ::: %s",getAccountAssetsRequest);

      this._controller.getAccountAssets(getAccountAssetsRequest)
        .then(irohaResponse => {
          if(irohaResponse.length === 0) {
            res.status(204).json(irohaResponse);
          } else if (irohaResponse.length > 0) {
            res.status(200).json(irohaResponse);
          } else {
            res.status(500).json(irohaResponse);
          }
        });
    });
  }

  private async _getAccountDetail() {
    await this._router.post('/getAccountDetail', (req: Request, res: Response, next: NextFunction) => {
      let getAccountDetailRequest = new QueryRequests.GetAccountDetailRequest;
      getAccountDetailRequest = req.body;
      console.log("Incoming request for query *getAccountDetail* ::: %s",getAccountDetailRequest);

      this._controller.getAccountDetail(getAccountDetailRequest)
        .then(irohaResponse => {
          if(irohaResponse.length === 0) {
            res.status(204).json(irohaResponse);
          } else if (irohaResponse.length > 0) {
            res.status(200).json(irohaResponse);
          } else {
            res.status(500).json(irohaResponse);
          }
        });
    });
  }

  // NEED TO SET UP ASSETS TO TEST
  private async _getAccountAssetTransactions() {
    await this._router.post('/getAccountAssetTransactions', (req: Request, res: Response, next: NextFunction) => {
      let getAccountAssetTransactionsRequest = new QueryRequests.GetAccountAssetTransactionsRequest;
      getAccountAssetTransactionsRequest = req.body;
      console.log("Incoming request for query *getAccountAssetTransactions* ::: %s",getAccountAssetTransactionsRequest);

      this._controller.getAccountAssetTransactions(getAccountAssetTransactionsRequest)
        .then(irohaResponse => {
          if(irohaResponse.allTransactionsSize === 0) {
            res.status(204).json(irohaResponse);
          } else if (irohaResponse.allTransactionsSize > 0) {
            res.status(200).json(irohaResponse);
          } else {
            res.status(500).json(irohaResponse);
          }
        });
    });
  }

  private async _getAssetInfo() {
    await this._router.post('/getAssetInfo', (req: Request, res: Response, next: NextFunction) => {
      let getAssetInfoRequest = new QueryRequests.GetAssetInfoRequest;
      getAssetInfoRequest = req.body;
      console.log("Incoming request for query *getAssetInfo* ::: %s",getAssetInfoRequest);

      this._controller.getAssetInfo(getAssetInfoRequest)
        .then(irohaResponse => {
          if (irohaResponse.assetId) {
            res.status(200).json(irohaResponse);
          } else {
            res.status(500).json(irohaResponse);
          }
        });
    });
  }

  private async _getBlock() {
    await this._router.post('/getBlock', (req: Request, res: Response, next: NextFunction) => {
      let getBlockRequest = new QueryRequests.GetBlockRequest;
      getBlockRequest = req.body;
      console.log("Incoming request for query *getBlock* ::: %s",getBlockRequest);

      this._controller.getBlock(getBlockRequest)
        .then(irohaResponse => {
          if (irohaResponse.payload) {
            res.status(200).json(irohaResponse);
          } else {
            res.status(500).json(irohaResponse);
          }
        });
    });
  }

  private async _getEngineReceipts() {
    await this._router.post('/getEngineReceipts', (req: Request, res: Response, next: NextFunction) => {
      let getEngineReceiptsRequest = new QueryRequests.GetEngineReceiptsRequest;
      getEngineReceiptsRequest = req.body;
      console.log("Incoming request for query *getEngineReceipts* ::: %s",getEngineReceiptsRequest);

      this._controller.getEngineReceipts(getEngineReceiptsRequest)
        .then(irohaResponse => {
          if (irohaResponse.payload) {
            res.status(200).json(irohaResponse);
          } else {
            res.status(500).json(irohaResponse);
          }
        });

    });
  }

  private async _getPeers() {
    await this._router.get('/getPeers', (req: Request, res: Response, next: NextFunction) => {
      console.log("Incoming request for query *getPeers*");

      this._controller.getPeers()
        .then(irohaResponse => {
          if (irohaResponse.payload) {
            res.status(200).json(irohaResponse);
          } else {
            res.status(500).json(irohaResponse);
          }
        });
    });
  }

  private async _getPendingTransactions() {
    await this._router.post('/getPendingTransactions', (req: Request, res: Response, next: NextFunction) => {
      let getPendingTxsRequest = new QueryRequests.GetPendingTxsRequest;
      getPendingTxsRequest = req.body;
      console.log("Incoming request for query *getEngineReceipts* ::: %s",getPendingTxsRequest);

      this._controller.getPendingTransactions(getPendingTxsRequest)
        .then(irohaResponse => {
          if (irohaResponse.length === 0) {
            res.status(204).json(irohaResponse);
          } else if(irohaResponse.length > 0) {
            res.status(200).json(irohaResponse);
          } else {
            res.status(500).json(irohaResponse);
          }
        });
    });
  }

  private async _getRawAccount() {
    await this._router.post('/getRawAccount', (req: Request, res: Response, next: NextFunction) => {
      let getRawAccountRequest = new QueryRequests.GetRawAccountRequest;
      getRawAccountRequest = req.body;
      console.log("Incoming request for query *getRawAccount* ::: %s",getRawAccountRequest);

      this._controller.getRawAccount(getRawAccountRequest)
        .then(irohaResponse => {
          if (irohaResponse.array) {
            res.status(200).json(irohaResponse);
          } else {
            res.status(500).json(irohaResponse);
          }
        });;
      
    });
  }

  private async _getRawPendingTransactions() {
    await this._router.get('/getRawPendingTransactions', (req: Request, res: Response, next: NextFunction) => {
      console.log("Incoming request for query *getRawPendingTransactions* ::: %s");
      
      this._controller.getRawPendingTransactions()
        .then(irohaResponse => {
          if (irohaResponse.payload) {
            res.status(200).json(irohaResponse);
          } else {
            res.status(500).json(irohaResponse);
          }
        });
    });
  }

  private async _getRolePermissions() {
    await this._router.post('/getRolePermissions', (req: Request, res: Response, next: NextFunction) => {
      let getRolePermissionsRequest = new QueryRequests.GetRolePermissionsRequest;
      getRolePermissionsRequest = req.body;
      console.log("Incoming request for query *getRolePermissions* ::: %s",getRolePermissionsRequest);

      this._controller.getRolePermissions(getRolePermissionsRequest)
        .then(irohaResponse => {
          if (irohaResponse.payload) {
            res.status(200).json(irohaResponse);
          } else {
            res.status(500).json(irohaResponse);
          }
        });
    });
  }

  private async _getRoles() {
    await this._router.get('/getRoles', (req: Request, res: Response, next: NextFunction) => {
      console.log("Incoming request for query *getRoles* ::: %s");

      this._controller.getRoles()
        .then(irohaResponse => {
          if (irohaResponse.length === 0) {
            res.status(204).json(irohaResponse);
          } else if(irohaResponse.length > 0){
            res.status(200).json(irohaResponse);
          } else {
            res.status(500).json(irohaResponse);
          }
        });
    });
  }

  private async _getSignatories() {
    await this._router.post('/getSignatories', (req: Request, res: Response, next: NextFunction) => {
      let getSignatoriesRequest = new QueryRequests.GetSignatoriesRequest;
      getSignatoriesRequest = req.body;
      console.log("Incoming request for query *getSignatories* ::: %s",getSignatoriesRequest);

      this._controller.getSignatories(getSignatoriesRequest)
        .then(irohaResponse => {
          if (irohaResponse.legnth === 0) {
            res.status(204).json(irohaResponse);
          } else if(irohaResponse.length > 0){
            res.status(200).json(irohaResponse);
          } else {
            res.status(500).json(irohaResponse);
          }
        });
    });
  }

  private async _getTransactions() {
    await this._router.post('/getTransactions', (req: Request, res: Response, next: NextFunction) => {
      let getTransactionsRequest = new QueryRequests.GetTransactionsRequest;
      getTransactionsRequest = req.body;
      console.log("Incoming request for query *getTransactions* ::: %s",getTransactionsRequest);
      
      this._controller.getTransactions(getTransactionsRequest)
        .then(irohaResponse => {
          if (irohaResponse.array) {
            res.status(200).json(irohaResponse);
          } else {
            res.status(500).json(irohaResponse);
          }
        });
    });
  }
}

export = new QueriesRouter().router;