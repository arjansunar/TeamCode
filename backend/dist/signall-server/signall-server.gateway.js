"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SignallServerGateway = void 0;
const common_1 = require("@nestjs/common");
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const rooms_service_1 = require("../rooms/rooms.service");
const users_1 = require("../users");
let SignallServerGateway = class SignallServerGateway {
    constructor(usersService, roomsService) {
        this.usersService = usersService;
        this.roomsService = roomsService;
        this.logger = new common_1.Logger('AppGateway');
        this.rooms = {};
        this.shRooms = {};
        this.groupChatMessages = [];
    }
    afterInit(server) {
        this.logger.log('Initialized');
    }
    handleJoinRoom(client, roomId, peerId) {
        if (!this.rooms[roomId])
            this.rooms[roomId] = [];
        if (!this.rooms[roomId].includes(peerId)) {
            this.rooms[roomId].push(peerId);
            client.join(roomId);
        }
        this.server.to(roomId).emit('user-joined', { peerId });
        client.on('disconnect', () => {
            this.rooms[roomId] = this.rooms[roomId].filter((el) => el !== peerId && el !== null);
            this.server.to(roomId).emit('user-disconnect', { peerId });
        });
    }
    async handleUpdatingUserPeerId(roomId, peerId, userId) {
        const user = await this.usersService.updateUserPeerId({
            id: userId,
            peerId,
        });
        const { username, peerId: myPeerId } = user;
        const participants = await Promise.all(this.rooms[roomId].map(async (id) => await this.usersService.findUserWithPeerId(id)));
        this.server.to(roomId).emit('get-users', {
            roomId,
            participants: participants,
            me: { username, myPeerId },
        });
    }
    handleNotifyTeacher(client, message, link, roomId, userId) {
        console.log('notify teacher', message, link, roomId);
        client.to(roomId).emit('notification-teach', { message, link, userId });
    }
    async handleEndMeeting(client, roomId, userId) {
        try {
            const ownerRoomId = await this.roomsService.getRoomByOwnerId(+userId);
            if (ownerRoomId.id === roomId) {
                this.server.in(roomId).socketsLeave(roomId);
                this.server.emit('group-disconnect');
                this.roomsService.deleteRoom(roomId);
            }
        }
        catch (error) {
            console.log(error);
        }
    }
    async handleGroupJoin(client, roomId) {
        client.join(roomId);
        const participants = await Promise.all(this.rooms[roomId].map(async (id) => await this.usersService.findUserWithPeerId(id)));
        if (participants.length < 0) {
            this.groupChatMessages = [];
        }
        this.server
            .to(client.id)
            .emit('group-joined', { history: this.groupChatMessages });
    }
    async handleSendToGroup(client, roomId, message) {
        const participants = await Promise.all(this.rooms[roomId].map(async (id) => await this.usersService.findUserWithPeerId(id)));
        if (participants.length < 0) {
            this.groupChatMessages = [];
        }
        this.groupChatMessages.push(message);
        client.broadcast.to(roomId).emit('group-message', { message: message });
    }
    handleJoinShRoom(client, roomId) {
        if (!this.shRooms[roomId])
            this.shRooms[roomId] = [];
        client.join(roomId);
        this.shRooms[roomId].push(client.id);
    }
    handleLeaveRoom(client, roomId) {
        client.disconnect();
        this.shRooms[roomId].splice(this.shRooms[roomId].indexOf(client.id), 1);
    }
    handleSendMessage(client, roomId, code) {
        client.broadcast.to(roomId).emit('message', { code });
    }
};
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], SignallServerGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('join-room'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)('roomId')),
    __param(2, (0, websockets_1.MessageBody)('peerId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, String, String]),
    __metadata("design:returntype", void 0)
], SignallServerGateway.prototype, "handleJoinRoom", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('update-user-peer-id'),
    __param(0, (0, websockets_1.MessageBody)('roomId')),
    __param(1, (0, websockets_1.MessageBody)('peerId')),
    __param(2, (0, websockets_1.MessageBody)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Number]),
    __metadata("design:returntype", Promise)
], SignallServerGateway.prototype, "handleUpdatingUserPeerId", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('notify-teacher'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)('message')),
    __param(2, (0, websockets_1.MessageBody)('link')),
    __param(3, (0, websockets_1.MessageBody)('roomId')),
    __param(4, (0, websockets_1.MessageBody)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, String, String, String, Number]),
    __metadata("design:returntype", void 0)
], SignallServerGateway.prototype, "handleNotifyTeacher", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('end-meeting'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)('roomId')),
    __param(2, (0, websockets_1.MessageBody)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, String, String]),
    __metadata("design:returntype", Promise)
], SignallServerGateway.prototype, "handleEndMeeting", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('join-group'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)('roomId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, String]),
    __metadata("design:returntype", Promise)
], SignallServerGateway.prototype, "handleGroupJoin", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('send-to-group'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)('roomId')),
    __param(2, (0, websockets_1.MessageBody)('message')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, String, Object]),
    __metadata("design:returntype", Promise)
], SignallServerGateway.prototype, "handleSendToGroup", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('sh-join-room'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)('roomId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, String]),
    __metadata("design:returntype", void 0)
], SignallServerGateway.prototype, "handleJoinShRoom", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('sh-leave-room'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)('roomId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, String]),
    __metadata("design:returntype", void 0)
], SignallServerGateway.prototype, "handleLeaveRoom", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('sh-send-message'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)('roomId')),
    __param(2, (0, websockets_1.MessageBody)('code')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, String, String]),
    __metadata("design:returntype", void 0)
], SignallServerGateway.prototype, "handleSendMessage", null);
SignallServerGateway = __decorate([
    (0, websockets_1.WebSocketGateway)(5001, {
        cors: {
            origin: '*',
        },
    }),
    __metadata("design:paramtypes", [users_1.UsersService,
        rooms_service_1.RoomsService])
], SignallServerGateway);
exports.SignallServerGateway = SignallServerGateway;
//# sourceMappingURL=signall-server.gateway.js.map