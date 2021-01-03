import dotenv from 'dotenv';
import express from 'express';
import IrohaRouter from './routers/IrohaRouter';
import bodyParser from 'body-parser';

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
let jsonParser = bodyParser.json();

server.app.use(bodyParser.json());
server.app.use(bodyParser.urlencoded({ extended: true }));

// make server app handle any route starting with '/api'
server.app.use('/api', server.router);

// make server listen on some port
((port = process.env.APP_PORT || 5000) => {
  server.app.listen(port, () => console.log(`> Listening on port ${port}`));
})();