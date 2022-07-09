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
  @SubscribeMessage('join-room')
  handleJoinRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody('roomId') roomId: string,
  ) {
    if (!this.Rooms[roomId]) this.Rooms[roomId] = [];
    // only 2 users can join the room
    if (this.Rooms[roomId].length < 2) {
      client.join(roomId);
      this.Rooms[roomId].push(client.id);
    }
  }

  @SubscribeMessage('leave-room')
  handleLeaveRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody('roomId') roomId: string,
  ) {
    client.disconnect();
    this.Rooms[roomId].splice(this.Rooms[roomId].indexOf(client.id), 1);
  }

  @SubscribeMessage('send-message')
  handleSendMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody('roomId') roomId: string,
    @MessageBody('code') code: string,
  ) {
    client.to(roomId).emit('message', code);
  }
}
