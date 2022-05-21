import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma';
import { v4 as uuidv4 } from 'uuid';
import { Room } from './types';

@Injectable()
export class RoomsService {
  private rooms: Room[] = [] as Room[];

  constructor(private prismaService: PrismaService) {}

  createNewRoom(ownerId: number) {
    const newRoom: Room = {
      id: uuidv4(),
      members: [],
      ownerId,
    };
    this.rooms.push(newRoom);
    return newRoom.id;
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
