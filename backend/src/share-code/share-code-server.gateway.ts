import { Logger } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';

@WebSocketGateway(5002, {
  cors: {
    origin: '*',
  },
})
export class ShareCodeServerGateway {
  private Rooms: Record<string, string[]> = {};
  private logger: Logger = new Logger('AppGateway');

  afterInit(server: any) {
    this.logger.log('Initialized share code server');
  }
}
