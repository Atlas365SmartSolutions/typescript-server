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
    //Queries
     this._getAccountDetail();
    this._getAccount();
    //this._getAccountAssets();
    //this._getAccountTransactions();
    //Commands
    this._setAccountDetail();
    // this._getPeers();
    // this._createAccount();
    // this._createDomain();
    // this._addSignatory();
    // this._removeSignatory();
    // this._appendRole();
    // this._transferAsset();
    // this._addAssetQuantity();
    // this._createRole();
    // this._compareAndSetAccountDetails();
  }

  /**
   * Connect routes to their matching controller endpoints.
   */
  private accountKey = 'admin@test';
  private batchKeySearch = 'batch_0013_TEST';
  private respBatchSearchKey = 'batch_0001';
  private async _getAccountDetail() {
    await this._router.get('/getAccountDetail', (req: Request, res: Response, next: NextFunction) => {
      this._controller.getAccountDetail(this.accountKey, this.batchKeySearch);
      this._controller.getAccountDetail$.pipe(filter(response => !!response)).subscribe(response => {
        !!response.response
        ? res.status(200).json(response.response)
        : res.status(500).json(response.error);
      });
    });
  }
  private async _getAccount() {
    await this._router.get('/getAccount', (req: Request, res: Response, next: NextFunction) => {
      this._controller.getAccount(this.accountKey);
      this._controller.getAccount$.pipe(filter(response => !!response)).subscribe(response => {
        !!response.response
        ? res.status(200).json(response.response)
        : res.status(500).json(response.error);
      });
    });
  }

  private async _setAccountDetail() {
    const body = {
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
    await this._router.post('/setAccountDetail', (req: Request, res: Response, next: NextFunction) => {
      this._controller.setAccountDetail(this.accountKey,body);
      this._controller.setAccountDetail$.pipe(filter(response => !!response)).subscribe(response => {
        !!response.response
        ? res.status(200).json(response.response)
        : res.status(500).json(response.error);
      });
    });
  }
}

export = new ThemeARouter().router;