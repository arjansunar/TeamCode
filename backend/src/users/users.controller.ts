import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { GetUser } from 'src/auth/decorator/get-user.decorator';
import { UserLoggedGuard } from 'src/auth/guards/user-loggin.guard';

@Controller('users')
@ApiTags('user routes')
@ApiBearerAuth('JWT')
@UseGuards(UserLoggedGuard)
export class UsersController {
  @Get('/me')
  async getMe(@GetUser() user) {
    return user;
  }
}
