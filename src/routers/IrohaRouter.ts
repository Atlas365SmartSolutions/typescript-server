import { Router } from 'express';
import QueriesRouter from './queries/QueriesRouter';
import CommandsRouter from './commands/CommandsRouter';
import AdminController from '../controllers/AdminController';

class IrohaRouter {
  private _IrohaRouter = Router();
  private _QueriesRouter = QueriesRouter;
  private _CommandsRouter = CommandsRouter;
  private _AdminController = AdminController;

  get router() {
    return this._IrohaRouter;
  }

  constructor() {
    this._configure();
  }

  /**
   * Connect routes to their matching routers.
   */
  private _configure() {
    this._IrohaRouter.use('/queries', this._QueriesRouter);
    this._IrohaRouter.use('/commands', this._CommandsRouter);
    this._IrohaRouter.use('/admin', this._AdminController);
  }
}

export = new IrohaRouter().router;