import { Controller, Dependencies, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { QueriesFactory } from './queries/queries.providers';

@Controller()
@Dependencies(QueriesFactory)
export class AppController {
  queriesFactory: QueriesFactory;

  constructor(
    private readonly appService: AppService,
    queriesFactory: QueriesFactory,
  ) {
    this.queriesFactory = queriesFactory;
  }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
