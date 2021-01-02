import { Injectable } from '@nestjs/common';
import grpc from 'grpc';

export const queriesProviders = [
  {
    provide: 'DATABASE_CONNECTION',
    useFactory: grpc.credentials.createInsecure(),
  },
];
