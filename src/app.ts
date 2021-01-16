import dotenv from 'dotenv';
import express from 'express';
import IrohaRouter from './routers/IrohaRouter';
import bodyParser from 'body-parser';
import grpc  from 'grpc';
import pino  from 'pino';
import expressPino  from 'express-pino-logger';
import morgan from 'morgan';
import { NodeHttpTransport } from '@improbable-eng/grpc-web-node-http-transport';

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
const grpcCreds = grpc.credentials.createInsecure();
const logger = pino({ level: process.env.LOG_LEVEL || 'info' });
const expressLogger = expressPino({ logger });

//server.app.use(expressLogger);
server.app.use(morgan('dev'));

server.app.use(function(req,res,next){
  let logHeaders = req.headers;
  console.log(Date.now());
  next();
});
server.app.use(bodyParser.json());
server.app.use(bodyParser.urlencoded({ extended: true }));

// make server app handle any route starting with '/api'
server.app.use('/api', server.router);

// make server listen on some port
((port = process.env.APP_PORT || 5000) => {
  server.app.listen(port, () => logger.info(`> Listening on port ${port}`));
})();