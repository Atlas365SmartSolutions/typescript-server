import { Inject, Injectable, Optional } from '@nestjs/common';
import { Client, ChannelCredentials } from 'grpc';
import grpc from 'grpc';
import { QueryService_v1Client as QueryService } from 'iroha-helpers-ts/lib/proto/endpoint_grpc_pb';
import queriesInit from 'iroha-helpers-ts/lib/queries/index';

@Injectable()
export class AppService {
  constructor(@Inject('grpc') private httpClient) {}
  private IROHA_ADDRESS = 'localhost:50051';
  private adminAccount = 'admin@test';
  private clientCreds: ChannelCredentials = grpc.credentials.createInsecure();
  private client: Client = new Client(this.IROHA_ADDRESS, this.clientCreds);
  private queryService = new QueryService(
    this.IROHA_ADDRESS,
    grpc.credentials.createInsecure(),
  );
  private adminPriv =
    'f101537e319568c765b2cc89698325604991dca57b9716b58016b253506cab70';
  private queries = queriesInit;

  getHello(): string {
    console.log('Getting response...');
    return 'Hello World!';
  }
}
