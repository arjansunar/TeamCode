/* eslint-disable @typescript-eslint/no-empty-function */
import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { Public } from './decorator/public.decorator';
import { UserLoginDTO } from './dto/user-login.dto';
import { JwtRefreshAuthGuard } from './guards/jwt-rt.guard';
import { UserLoggedGuard } from './guards/user-loggin.guard';

@Controller('auth')
@ApiTags('Authentication route')
export class AuthController {
  constructor(private authService: AuthService) {}

  // route to access github oauth
  @Get('/')
  @Public()
  @UseGuards(AuthGuard('github'))
  async githubAuth() {}

  // callback url called after github strategy validates the user
  @Get('/github/callback')
  @Public()
  @UseGuards(AuthGuard('github'))
  async githubAuthRedirect(
    @Req() req,
    @Res({ passthrough: true }) res: Response,
  ) {
    req.user.tokens = await this.authService.login(req.user);
    const authData = JSON.stringify(
      await this.authService.githubLogin({ ...req }),
    );

    // res.redirect(`http://localhost:3000/login?auth_data=${authData}`);
    return authData;
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
