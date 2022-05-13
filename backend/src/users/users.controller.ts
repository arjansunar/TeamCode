import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { GetUser } from 'src/auth/decorator/get-user.decorator';
import { UserLoggedGuard } from 'src/auth/guards/user-loggin.guard';
import { TokenPayload } from 'src/auth/types';
import { UserRoleDTO } from './dto';
import { UsersService } from './users.service';

@Controller('users')
@ApiTags('user routes')
@ApiBearerAuth('JWT')
@UseGuards(UserLoggedGuard)
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('/me')
  async getMe(@GetUser() user) {
    return user;
  }

  @Post('/role')
  async updateUserRole(
    @GetUser() user: TokenPayload,
    @Body() userRoleDto: UserRoleDTO,
  ) {
    return this.usersService.updateUserRole(user.id, userRoleDto.role);
  }
}
