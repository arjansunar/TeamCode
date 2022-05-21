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
  }

  //   const joinRoom = ({ roomId, peerId, userName }: IJoinRoomParams) => {
  //     if (!rooms[roomId]) rooms[roomId] = {};
  //     if (!chats[roomId]) chats[roomId] = [];
  //     socket.emit("get-messages", chats[roomId]);
  //     console.log("user joined the room", roomId, peerId, userName);
  //     rooms[roomId][peerId] = { peerId, userName };
  //     socket.join(roomId);
  //     socket.to(roomId).emit("user-joined", { peerId, userName });
  //     socket.emit("get-users", {
  //         roomId,
  //         participants: rooms[roomId],
  //     });

  //     socket.on("disconnect", () => {
  //         console.log("user left the room", peerId);
  //         leaveRoom({ roomId, peerId });
  //     });
  //

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

    client.to(roomId).emit('user-joined', { peerId });

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
      this.server.to(roomId).emit('user-disconnect', peerId);
    });
  }

  // @SubscribeMessage('join-room')
  // handleJoinRoom(
  //   @ConnectedSocket() client: Socket,
  //   @MessageBody() roomId: string,
  // ) {
  //   if (this.rooms[roomId]) {
  //     // Receiving peer joins the room
  //     this.rooms[roomId].push(client.id);
  //   } else {
  //     // Initiating peer create a new room
  //     this.rooms[roomId] = [client.id];
  //   }

  //   this.server.emit('joined', {
  //     rooms: this.rooms,
  //     id: roomId,
  //   });

  //   console.log('websocket rooms', this.rooms);

  //   /*
  //     If both initiating and receiving peer joins the room,
  //     we will get the other user details.
  //     For initiating peer it would be receiving peer and vice versa.
  // */
  //   const otherUser = this.rooms[roomId].find((id) => id !== client.id);
  //   if (otherUser) {
  //     client.emit('other-user', otherUser);
  //     client.to(otherUser).emit('user-joined', client.id);
  //   }
  // }

  // /*
  //       The initiating peer offers a connection
  //   */
  // @SubscribeMessage('offer')
  // handleConnectionOffer(@MessageBody() payload: Payload) {
  //   //  for offer
  //   //   socket.on('offer', payload => {
  //   //     io.to(payload.target).emit('offer', payload);
  //   // });
  //   this.server.to(payload.target).emit('offer', payload);
  // }

  // @SubscribeMessage('answer')
  // handleAnswer(@MessageBody() payload: Payload) {
  //   //  for answer
  //   //   socket.on('answer', payload => {
  //   //     io.to(payload.target).emit('answer', payload);
  //   // });
  //   this.server.to(payload.target).emit('answer', payload);
  // }

  // @SubscribeMessage('ice-candidate')
  // handleIceCandidate(@MessageBody() incoming: Payload) {
  //   //  for ice-candidate
  //   //   socket.on('ice-candidate', incoming => {
  //   //     io.to(incoming.target).emit('ice-candidate', incoming.candidate);
  //   // })
  //   this.server.to(incoming.target).emit('ice-candidate', incoming.candidate);
  // }
}
