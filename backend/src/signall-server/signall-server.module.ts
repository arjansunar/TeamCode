import { Module } from '@nestjs/common';
import { RoomsModule } from 'src/rooms/rooms.module';
import { UsersModule } from 'src/users/users.module';
import { SignallServerGateway } from './signall-server.gateway';

@Module({
  imports: [UsersModule, RoomsModule],
  providers: [SignallServerGateway],
})
export class SignallServerModule {}
