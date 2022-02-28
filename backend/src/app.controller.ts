import { Get, Controller, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
@Controller()
export class AppController {
  //making it protected
  @Get()
  @UseGuards(JwtAuthGuard)
  hello(@Request() req): string {
    return req.user;
  }
}
