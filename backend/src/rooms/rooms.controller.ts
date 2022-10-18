import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { UserLoggedGuard } from 'src/auth/guard/user-loggin.guard';
import { Role } from 'src/users/decorator/role.decorator';
import { Role as UserRole } from '@prisma/client';

import { RoleGuard } from 'src/users/guard/role.guard';
import { RoomsService } from './rooms.service';
import { GetUser } from 'src/auth/decorator/get-user.decorator';
import { Room } from './types';

@Controller('rooms')
@UseGuards(UserLoggedGuard)
export class RoomsController {
  constructor(private roomsService: RoomsService) {}

  @Post('/generate')
  @Role(UserRole.TEACHER)
  @UseGuards(RoleGuard)
  async createRoom(@GetUser('id') ownerId) {
    return await this.roomsService.createNewRoom(ownerId);
  }

  @Get('/my-room')
  @Role(UserRole.TEACHER)
  @UseGuards(RoleGuard)
  async getOwnerRoom(@GetUser('id') ownerId: number) {
    return await this.roomsService.getRoomByOwnerId(ownerId);
  }

  @Delete('/end-meeting')
  @Role(UserRole.TEACHER)
  @UseGuards(RoleGuard)
  async endMeeting(roomId: Room['id']) {
    return await this.roomsService.deleteRoom(roomId);
  }

  @Get('/room-details/:roomId')
  async getRoomDetails(@Param('roomId') roomId: string): Promise<Room> {
    console.log('hya aayo', roomId);
    return await this.roomsService.getRoom(roomId);
  }

  @Post('/add-member/:roomId')
  async addMember(@Param('roomId') roomId: string, @GetUser('id') memberId) {
    return await this.roomsService.addMembers(roomId, memberId);
  }
}
