import { HttpService } from '@nestjs/axios';
import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { Public } from './decorator/public.decorator';
import { UserLoginDTO } from './dto/user-login.dto';
import { JwtRefreshAuthGuard } from './guards/jwt-rt.guard';
import { UserLoggedGuard } from './guards/user-loggin.guard';

@Controller('auth')
@ApiTags('Authentication route')
export class AuthController {
  constructor(private authService: AuthService) {}

  // routes to access github oauth
  @Get('/')
  @Public()
  @UseGuards(AuthGuard('github'))
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  async githubAuth() {}

  @Get('/github/callback')
  @Public()
  @UseGuards(AuthGuard('github'))
  async githubAuthRedirect(@Req() req) {
    req.user.tokens = await this.authService.login(req.user);
    console.log(req.user);
    return await this.authService.githubLogin({ ...req });
  }

  @Get('/refresh')
  @Public()
  @UseGuards(JwtRefreshAuthGuard)
  @ApiBearerAuth('JWT-RT')
  async refresh(@Req() req) {
    const { id, username } = req.user;
    const user: UserLoginDTO = {
      id: +id,
      username,
    };
    const refresh_token = req.user.refresh_token;
    const tokens = await this.authService.getAccessFromRefreshToken(
      refresh_token,
      user,
    );
    return {
      id,
      username,
      tokens,
    };
  }

  // logout route changes the user refresh token
  @Get('/logout')
  @ApiBearerAuth('JWT')
  @UseGuards(UserLoggedGuard)
  async logout(@Req() req) {
    return await this.authService.logout(+req.user.id);
  }
}
