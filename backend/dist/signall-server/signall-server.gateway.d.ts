import { OnGatewayInit } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { RoomsService } from 'src/rooms/rooms.service';
import { UsersService } from 'src/users';
import { AppMessage } from './types';
export declare class SignallServerGateway implements OnGatewayInit {
    private usersService;
    private roomsService;
    constructor(usersService: UsersService, roomsService: RoomsService);
    private server;
    private logger;
    private rooms;
    private shRooms;
    private groupChatMessages;
    afterInit(server: any): void;
    handleJoinRoom(client: Socket, roomId: string, peerId: string): void;
    handleUpdatingUserPeerId(roomId: string, peerId: string, userId: number): Promise<void>;
    handleNotifyTeacher(client: Socket, message: string, link: string, roomId: string, userId: number): void;
    handleEndMeeting(client: Socket, roomId: string, userId: string): Promise<void>;
    handleGroupJoin(client: Socket, roomId: string): Promise<void>;
    handleSendToGroup(client: Socket, roomId: string, message: AppMessage): Promise<void>;
    handleJoinShRoom(client: Socket, roomId: string): void;
    handleLeaveRoom(client: Socket, roomId: string): void;
    handleSendMessage(client: Socket, roomId: string, code: string): void;
}
