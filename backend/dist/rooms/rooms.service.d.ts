import { NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma';
import { UsersService } from 'src/users';
import { Room } from './types';
export declare class RoomsService {
    private prismaService;
    private usersService;
    private rooms;
    constructor(prismaService: PrismaService, usersService: UsersService);
    createNewRoom(ownerId: number): Promise<NotFoundException | import(".prisma/client").Room>;
    deleteRoom(roomId: Room['id']): Promise<void>;
    getRoomByOwnerId(ownerId: number): Promise<import(".prisma/client").Room>;
    getRoom(roomId: string): Promise<Room>;
    addMembers(roomId: string, memberId: number): Promise<Room[]>;
}
