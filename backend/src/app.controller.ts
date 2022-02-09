import { Get, Controller, UseGuards, Req, Request } from '@nestjs/common';
import { AppService } from './app.service';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth/auth.service';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private authService: AuthService,
  ) {}

  //making it protected
  @Get()
  @UseGuards(JwtAuthGuard)
  hello(@Request() req): string {
    return req.user;
  }

  @Get('/auth')
  @UseGuards(AuthGuard('github'))
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  async githubAuth() {}

  @Get('auth/github/callback')
  @UseGuards(AuthGuard('github'))
  async githubAuthRedirect(@Req() req) {
    req.user.access_token = await this.authService.login(req.user);
    return await this.appService.githubLogin({ ...req });
  }
}
