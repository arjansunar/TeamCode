import { Get, Controller, UseGuards, Request } from '@nestjs/common';
import { AppService } from './app.service';
import { UserLogGuard } from './auth/guards/user-loggin.guard';
@Controller()
export class AppController {
  constructor(private appService: AppService) {}
  //making it protected
  @Get()
  @UseGuards(UserLogGuard)
  async hello(@Request() req): Promise<string> {
    return await this.appService.getHello();
  }
}
