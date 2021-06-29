import dotenv from 'dotenv';
import express from 'express';
import IrohaRouter from './routers/IrohaRouter';
import pino  from 'pino';
import morgan from 'morgan';
import { ATLAS_API_KEY_HEADER, IROHA_ACCOUNT_ID_HEADER, IROHA_ACCOUNT_KEY_HEADER } from './common/Constants';

// load the environment variables from the .env file
dotenv.config({
  path: '.env'
});

/**
 * Express server application class.
 * @description Will later contain the routing system.
 */
class Server {
    public app = express();
    public router = IrohaRouter;
  }
  

// initialize server app
const server = new Server();
//const grpcCreds = grpc.credentials.createInsecure();
const logger = pino({ level: process.env.LOG_LEVEL || 'info' });
//const expressLogger = expressPino({ logger });

//server.app.use(expressLogger);
server.app.use(morgan('dev'));

//Check for and print request headers
server.app.use(function(req,res,next){
  let irohaAccountHeader = {
    accountId: req.headers[IROHA_ACCOUNT_ID_HEADER] !== undefined ? req.headers[IROHA_ACCOUNT_ID_HEADER]:"",
    accountKey: req.headers[IROHA_ACCOUNT_KEY_HEADER] !== undefined ? req.headers[IROHA_ACCOUNT_KEY_HEADER]:"",
    atlasApiKey: req.headers[ATLAS_API_KEY_HEADER]  !== undefined ? req.headers[ATLAS_API_KEY_HEADER]:""
  };
  
  logger.info(irohaAccountHeader,"::: incoming iroha header");
  console.log(Date.now());
  next();
});

//Body parser settings
server.app.use(express.json());
server.app.use(express.urlencoded({ extended: true }));

// make server app handle any route starting with '/api'
server.app.use('/api', server.router);

// make server listen on some port
((port = process.env.APP_PORT || 5000) => {
  server.app.listen(port, () => logger.info(`> Listening on port ${port}`));
})();