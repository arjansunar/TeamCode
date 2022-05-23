import { Logger } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

interface Payload {
  target: string;
  candidate: string;
}

interface RoomParams {
  roomId: string;
  peerId: string;
}

@WebSocketGateway(5001, {
  cors: {
    origin: '*',
  },
})
export class SignallServerGateway implements OnGatewayInit {
  @WebSocketServer()
  private server: Server;

  private logger: Logger = new Logger('AppGateway');
  // use db for later
  private rooms: Record<string, string[]> = {};

  afterInit(server: any) {
    this.logger.log('Initialized');
    console.log('rooms', this.rooms);
  }

  @SubscribeMessage('join-room')
  handleJoinRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody('roomId') roomId: string,
    @MessageBody('peerId') peerId: string,
  ) {
    // checks if the room id is present. if not it creates the room
    if (!this.rooms[roomId]) this.rooms[roomId] = [];
    if (!this.rooms[roomId].includes(peerId)) {
      this.rooms[roomId].push(peerId);
      client.join(roomId);
    }

    this.server.to(roomId).emit('user-joined', { peerId });

    client.to(roomId).emit('get-users', {
      roomId,
      participants: this.rooms[roomId],
    });

    client.on('disconnect', () => {
      // console.log('user left the room');
      // remove peer on disconnect
      this.rooms[roomId] = this.rooms[roomId].filter(
        (el) => el !== peerId && el !== null,
      );
      this.server.to(roomId).emit('user-disconnect', { peerId });
    });
  }
}
