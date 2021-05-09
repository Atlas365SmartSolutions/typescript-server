import { NextFunction, Request, Response, Router } from 'express';
import FarmerService from '../services/FarmerService';

class FarmerController {
    private _router = Router();
    private _farmerService = FarmerService;

    constructor(){
    this._onboardFarmer();
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

}

export = new FarmerController().router;;