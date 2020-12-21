import { Router } from 'express';
import QueriesRouter from './queries/QueriesRouter';
import CommandsRouter from './commands/CommandsRouter';

class IrohaRouter {
  private _IrohaRouter = Router();
  private _QueriesRouter = QueriesRouter;
  private _CommandsRouter = CommandsRouter;

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
  }
}

export = new IrohaRouter().router;