import { Controller, Get } from '@nestjs/common';
import { Public } from './auth/decorator/public.decorator';

@Controller()
export class AppController {
  @Get('/')
  @Public()
  handleEntry() {
    return 'hello there';
  }
}
