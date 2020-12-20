import { NextFunction, Request, Response, Router } from 'express';
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
    //this._getAccount();
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
  private async _getAccountDetail() {
    await this._router.get('/', (req: Request, res: Response, next: NextFunction) => {
      res.status(200).json(this._controller.getAccountDetail());
    });
  }

  private async _setAccountDetail() {
    await this._router.post('/setAccountDetail', (req: Request, res: Response, next: NextFunction) => {
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

      console.log(JSON.stringify(body));
      res.status(200).json(this._controller.setAccountDetail(body));
    });
  }
}

export = new ThemeARouter().router;