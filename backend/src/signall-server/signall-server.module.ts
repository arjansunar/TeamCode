import { Module } from '@nestjs/common';
import { UsersModule } from 'src/users/users.module';
import { SignallServerGateway } from './signall-server.gateway';

@Module({
  imports: [UsersModule],
  providers: [SignallServerGateway],
})
export class SignallServerModule {}
