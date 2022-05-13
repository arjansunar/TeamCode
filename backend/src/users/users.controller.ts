import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { Role as UserRole } from '@prisma/client';
import { GetUser } from 'src/auth/decorator/get-user.decorator';
import { UserLoggedGuard } from 'src/auth/guard/user-loggin.guard';
import { ParsedJWTToken } from 'src/auth/types';
import { Role } from './decorator/role.decorator';
import { UserRoleDTO } from './dto';
import { RoleGuard } from './guard/role.guard';
import { UsersService } from './users.service';

@Controller('users')
@UseGuards(UserLoggedGuard)
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('/me')
  async getMe(@GetUser() user) {
    return user;
  }

  @Post('/role')
  async updateUserRole(
    @GetUser() user: ParsedJWTToken,
    @Body() userRoleDto: UserRoleDTO,
  ) {
    return this.usersService.updateUserRole(user.id, userRoleDto.role);
  }

  @Get('/teacher')
  @Role(UserRole.TEACHER)
  @UseGuards(RoleGuard)
  protectedTeacherOnlyRoute() {
    return 'You are a teacher ';
  }
}
