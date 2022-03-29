import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { Public } from './decorator/public.decorator';
import { UserLoginDTO } from './dto/user-login.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { JwtRefreshAuthGuard } from './guards/jwt-rt.guard';

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
    return await this.authService.githubLogin({ ...req });
  }

  @Get('/refresh')
  @Public()
  @UseGuards(JwtRefreshAuthGuard)
  async refresh(@Req() req) {
    const { id, username } = req.user;
    const user: UserLoginDTO = {
      id: +id,
      username,
    };
    const refreshToken = req.user.refreshToken;
    const tokens = await this.authService.getAccessFromRefreshToken(
      refreshToken,
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
  @UseGuards(JwtAuthGuard)
  async logout(@Req() req) {
    return await this.authService.logout(+req.user.id);
  }
}
