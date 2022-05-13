import { Module } from '@nestjs/common';
import { SignallServerGateway } from './signall-server.gateway';

@Module({
  providers: [SignallServerGateway],
})
export class SignallServerModule {}
