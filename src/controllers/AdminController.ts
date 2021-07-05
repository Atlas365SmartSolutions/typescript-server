import { Request, Response, Router } from 'express';
import { createKeyPair } from '../common/Utils';
import { IROHA_COMMITTED_STATUS } from '../common/Constants';
import FarmerService from '../services/FarmerService';
import EcoPointsService from '../services/EcoPointsService';
import LicenseeService from '../services/LicenseeService';

import pino = require('pino');

class AdminController {
    private _router = Router();
    private logger = pino({ level: process.env.LOG_LEVEL || 'info' });
    private farmerService = FarmerService;
    private ecoPointsService = EcoPointsService;
    private licenseeService = LicenseeService;

    get router() {
      return this._router;
    }

    constructor(){
        this._onboardEcoPointsMember();
        this._onboardLicensee();
        this._onboardFarmer();
        this._generateKeyPair();
    }

    private async _onboardEcoPointsMember(){
      this._router.post('/onboardEcoPointsMember', (req: Request, res: Response) => {
        this.logger.info("Incoming request for *onboardEcoPointsMember* :::");
        this.logger.info(res.locals.irohaAccountHeader,"Incoming Iroha header::");
        this.ecoPointsService.onboardMember(req.body,res.locals.irohaAccountHeader)
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

    private async _onboardFarmer(){
      this._router.post('/onboardFarmer', (req: Request, res: Response) => {
        this.logger.info("Incoming request for *onboardFarmer* :::");
        this.logger.info(res.locals.irohaAccountHeader,"Incoming Iroha header::");
        this.farmerService.adminOnboardFarmer(req.body,res.locals.irohaAccountHeader)
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

    private async _onboardLicensee() {
      this._router.post('/onboardLicensee', (req: Request, res: Response) => {
        this.logger.info("Incoming request for *onboardFarmer* :::");
        this.logger.info(res.locals.irohaAccountHeader,"Incoming Iroha header::");
        this.licenseeService.onboardLicensee(req.body,res.locals.irohaAccountHeader)
          .then((irohaResponse:any) => {
              console.log('REQ:::::::', req.body)
            if (irohaResponse.status === IROHA_COMMITTED_STATUS) {
              res.status(200).json(irohaResponse);
            } else {
              res.status(500).json(irohaResponse);
            }
          });
      });

 
    }

  private async _generateKeyPair() {
    this._router.get('/newKeyPair', (req: Request, res: Response) => {
        console.log("Incoming request for *generateKeyPair* :::");
        res.send(createKeyPair());
      });
  }
}

export = new AdminController().router;