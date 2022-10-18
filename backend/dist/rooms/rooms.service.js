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
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoomsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_1 = require("../prisma");
const users_1 = require("../users");
const uuid_1 = require("uuid");
let RoomsService = class RoomsService {
    constructor(prismaService, usersService) {
        this.prismaService = prismaService;
        this.usersService = usersService;
        this.rooms = [];
    }
    async createNewRoom(ownerId) {
        const owner = await this.usersService.findUserWithId(ownerId);
        if (!owner)
            return new common_1.NotFoundException('Owner not found');
        const room = await this.prismaService.room.findUnique({
            where: { ownerId },
        });
        if (room) {
            await this.prismaService.room.delete({
                where: {
                    ownerId,
                },
            });
        }
        const newRoom = await this.prismaService.room.create({
            data: {
                id: (0, uuid_1.v4)(),
                ownerId: owner.id,
            },
        });
        return newRoom;
    }
    async deleteRoom(roomId) {
        await this.prismaService.room.delete({
            where: {
                id: roomId,
            },
        });
    }
    async getRoomByOwnerId(ownerId) {
        const room = await this.prismaService.room.findUnique({
            where: { ownerId },
        });
        return room;
    }
    async getRoom(roomId) {
        const room = await this.prismaService.room.findUnique({
            where: { id: roomId },
        });
        if (!room)
            throw new common_1.NotFoundException('Room id not found');
        return room;
    }
    async addMembers(roomId, memberId) {
        const room = this.rooms.find((el) => el.id === roomId);
        if (!room)
            throw new common_1.NotFoundException('Room id not found');
        const roomsFillteredCopy = this.rooms.filter((el) => el.id !== roomId);
        const member = await this.prismaService.user.findUnique({
            where: {
                id: memberId,
            },
        });
        if (!member)
            throw new common_1.NotFoundException('Member user not found');
        room.members.push(member.id);
        roomsFillteredCopy.push(room);
        this.rooms = roomsFillteredCopy;
        return this.rooms;
    }
};
RoomsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_1.PrismaService,
        users_1.UsersService])
], RoomsService);
exports.RoomsService = RoomsService;
//# sourceMappingURL=rooms.service.js.map