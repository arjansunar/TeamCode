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
import { RoomsService } from 'src/rooms/rooms.service';
import { UsersService } from 'src/users';
import { AppMessage } from './types';

@WebSocketGateway(5001, {
  cors: {
    origin: '*',
  },
})
export class SignallServerGateway implements OnGatewayInit {
  constructor(
    private usersService: UsersService,
    private roomsService: RoomsService,
  ) {}
  @WebSocketServer()
  private server: Server;

  private logger: Logger = new Logger('AppGateway');
  // use db for later
  private rooms: Record<string, string[]> = {};

  private shRooms: Record<string, string[]> = {};

  private groupChatMessages: AppMessage[] = [];

  afterInit(server: any) {
    this.logger.log('Initialized');
  }

  // should handle updating the user peer id in db as well [to-do]
  @SubscribeMessage('join-room')
  handleJoinRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody('roomId') roomId: string,
    @MessageBody('peerId') peerId: string,
    // @MessageBody('userId') userId: number,
  ) {
    // checks if the room id is present. if not it creates the room
    if (!this.rooms[roomId]) this.rooms[roomId] = [];
    if (!this.rooms[roomId].includes(peerId)) {
      this.rooms[roomId].push(peerId);

      // save peer id
      // await this.usersService.updateUserPeerId({ id: userId, peerId });
      client.join(roomId);
    }

    this.server.to(roomId).emit('user-joined', { peerId });

    client.on('disconnect', () => {
      // remove peer on disconnect
      this.rooms[roomId] = this.rooms[roomId].filter(
        (el) => el !== peerId && el !== null,
      );
      this.server.to(roomId).emit('user-disconnect', { peerId });
    });
  }

  @SubscribeMessage('update-user-peer-id')
  async handleUpdatingUserPeerId(
    @MessageBody('roomId') roomId: string,
    @MessageBody('peerId') peerId: string,
    @MessageBody('userId') userId: number,
  ) {
    const user = await this.usersService.updateUserPeerId({
      id: userId,
      peerId,
    });

    const { username, peerId: myPeerId } = user;

    const participants = await Promise.all(
      this.rooms[roomId].map(
        async (id) => await this.usersService.findUserWithPeerId(id),
      ),
    );
    this.server.to(roomId).emit('get-users', {
      roomId,
      participants: participants,
      me: { username, myPeerId },
    });
  }

  @SubscribeMessage('notify-teacher')
  handleNotifyTeacher(
    @ConnectedSocket() client: Socket,
    @MessageBody('message') message: string,
    @MessageBody('link') link: string,
    @MessageBody('roomId') roomId: string,
    @MessageBody('userId') userId: number,
  ) {
    console.log('notify teacher', message, link, roomId);
    client.to(roomId).emit('notification-teach', { message, link, userId });
  }

  @SubscribeMessage('end-meeting')
  async handleEndMeeting(
    @ConnectedSocket() client: Socket,
    @MessageBody('roomId') roomId: string,
    @MessageBody('userId') userId: string,
  ) {
    try {
      const ownerRoomId = await this.roomsService.getRoomByOwnerId(+userId);
      if (ownerRoomId.id === roomId) {
        // disconnect all sockets in the room
        this.server.in(roomId).socketsLeave(roomId);
        // emit event to log users out of meeting
        this.server.emit('group-disconnect');
        // delete the room
        this.roomsService.deleteRoom(roomId);
      }
    } catch (error) {
      console.log(error);
    }
  }

  /* group chat */
  @SubscribeMessage('join-group')
  async handleGroupJoin(
    @ConnectedSocket() client: Socket,
    @MessageBody('roomId') roomId: string,
  ) {
    client.join(roomId);
    const participants = await Promise.all(
      this.rooms[roomId].map(
        async (id) => await this.usersService.findUserWithPeerId(id),
      ),
    );
    if (participants.length < 0) {
      this.groupChatMessages = [];
    }
    this.server
      .to(client.id)
      .emit('group-joined', { history: this.groupChatMessages });
  }
  @SubscribeMessage('send-to-group')
  async handleSendToGroup(
    @ConnectedSocket() client: Socket,
    @MessageBody('roomId') roomId: string,
    @MessageBody('message') message: AppMessage,
  ) {
    const participants = await Promise.all(
      this.rooms[roomId].map(
        async (id) => await this.usersService.findUserWithPeerId(id),
      ),
    );
    if (participants.length < 0) {
      this.groupChatMessages = [];
    }
    this.groupChatMessages.push(message);
    client.broadcast.to(roomId).emit('group-message', { message: message });
  }
  /*! for sharing code  */
  @SubscribeMessage('sh-join-room')
  handleJoinShRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody('roomId') roomId: string,
  ) {
    if (!this.shRooms[roomId]) this.shRooms[roomId] = [];
    // only 2 users can join the room
    // if (this.shRooms[roomId].length < 2) {
    client.join(roomId);
    this.shRooms[roomId].push(client.id);
    // }
  }

  @SubscribeMessage('sh-leave-room')
  handleLeaveRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody('roomId') roomId: string,
  ) {
    client.disconnect();
    this.shRooms[roomId].splice(this.shRooms[roomId].indexOf(client.id), 1);
  }

  @SubscribeMessage('sh-send-message')
  handleSendMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody('roomId') roomId: string,
    @MessageBody('code') code: string,
  ) {
    client.broadcast.to(roomId).emit('message', { code });
  }
}
