import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma';
import { UsersService } from 'src/users';
import { v4 as uuidv4 } from 'uuid';
import { Room } from './types';

@Injectable()
export class RoomsService {
  private rooms: Room[] = [] as Room[];

  constructor(
    private prismaService: PrismaService,
    private usersService: UsersService,
  ) {}

  async createNewRoom(ownerId: number) {
    const owner = await this.usersService.findUserWithId(ownerId);

    if (!owner) return new NotFoundException('Owner not found');
    const room = await this.prismaService.room.findUnique({
      where: { ownerId },
    });
    // if there is previous room with same owner id delete it
    if (room) {
      await this.prismaService.room.delete({
        where: {
          ownerId,
        },
      });
    }
    const newRoom = await this.prismaService.room.create({
      data: {
        id: uuidv4(),
        ownerId: owner.id,
      },
    });
    return newRoom;
  }

  async deleteRoom(roomId: Room['id']) {
    await this.prismaService.room.delete({
      where: {
        id: roomId,
      },
    });
  }

  async getRoomByOwnerId(ownerId: number) {
    const room = await this.prismaService.room.findUnique({
      where: { ownerId },
    });
    return room;
  }

  getRoom(roomId: string): Room {
    const room = this.rooms.find((el) => el.id === roomId);
    if (!room) throw new NotFoundException('Room id not found');
    return room;
  }

  async addMembers(roomId: string, memberId: number) {
    const room = this.rooms.find((el) => el.id === roomId);
    if (!room) throw new NotFoundException('Room id not found');
    const roomsFillteredCopy = this.rooms.filter((el) => el.id !== roomId);

    const member = await this.prismaService.user.findUnique({
      where: {
        id: memberId,
      },
    });
    if (!member) throw new NotFoundException('Member user not found');

    room.members.push(member.id);

    roomsFillteredCopy.push(room);
    this.rooms = roomsFillteredCopy;
    return this.rooms;
  }
}
