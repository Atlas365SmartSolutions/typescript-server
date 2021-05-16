import { NextFunction, Request, Response, Router } from 'express';
import { IROHA_ACCOUNT_ID_HEADER, IROHA_ACCOUNT_KEY_HEADER } from '../common/Constants';
import FarmerService from '../services/FarmerService';

class FarmerController {
    private _router = Router();
    private _farmerService = FarmerService;

    constructor(){
      this._onboardFarmer();
      this._initalizeFields();
      this._updateField();
    }

    get router() {
    return this._router;
    }

    private async _onboardFarmer() {
        this._router.post('/onboardFarmer',  (req: Request, res: Response) => {
          //let addAssetQuantityRequest = new AdjustAssetQuantityRequest(req.body.assetId, req.body.amount);
          //addAssetQuantityRequest = req.body;
          console.log("Incoming request for command *onboardFarmer* ::: %s",req.body);
          
           this._farmerService.onboardFarmer(req.body,req.headers)
            .then((irohaResponse:any) => {
                console.log('REQ:::::::', req.body)
              if (irohaResponse.status === 'COMMITTED') {
                res.status(200).json(irohaResponse);
              } else {
                res.status(500).json(irohaResponse);
              }
            });      
        });
      }

    private async _initalizeFields() {
      this._router.post('/initalizeFields',  (req: Request, res: Response) => {
        //let addAssetQuantityRequest = new AdjustAssetQuantityRequest(req.body.assetId, req.body.amount);
        //addAssetQuantityRequest = req.body;
        console.log("Incoming request for command *_initalizeFields* ::: %s",req.body);
        let txCreatorAccount:any = {
          irohaAccountId: req.headers[IROHA_ACCOUNT_ID_HEADER],
          irohaAccountKey: req.headers[IROHA_ACCOUNT_KEY_HEADER]
        };
          this._farmerService.initializeFields(req.body,txCreatorAccount)
          .then((irohaResponse:any) => {
              console.log('REQ:::::::', req.body)
            if (irohaResponse.status === 'COMMITTED') {
              res.status(200).json(irohaResponse);
            } else {
              res.status(500).json(irohaResponse);
            }
          });      
      });
    }

    private async _updateField() {
      this._router.post('/updateField',  (req: Request, res: Response) => {

        console.log("Incoming request for command *updateField* ::: %s",req.body);
        let txCreatorAccount:any = {
          irohaAccountId: req.headers[IROHA_ACCOUNT_ID_HEADER],
          irohaAccountKey: req.headers[IROHA_ACCOUNT_KEY_HEADER]
        };
          this._farmerService.updateField(req.body,txCreatorAccount)
          .then((irohaResponse:any) => {
              console.log('REQ:::::::', req.body)
            if (irohaResponse.status === 'COMMITTED') {
              res.status(200).json(irohaResponse);
            } else {
              res.status(500).json(irohaResponse);
            }
          });      
      });
    }

}

export = new FarmerController().router;;