import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { QueriesFactory } from './queries/queries.providers';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService, QueriesFactory],
})
export class AppModule {}
