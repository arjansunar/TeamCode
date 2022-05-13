import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/prisma';
import { UsersService } from 'src/users';
import { Tokens, UserLoginDTO } from './dto';
@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private prisma: PrismaService,
    private userService: UsersService,
  ) {}

  async hashData(data: string) {
    return await bcrypt.hash(data, 10);
  }

  async logout(id: number) {
    const user = await this.prisma.user.updateMany({
      where: {
        id,
        hashedRt: {
          not: null,
        },
      },
      data: {
        hashedRt: null,
      },
    });
    return user[0];
  }

  /* 
    first 72 chars of jwt tokens are same
    bycrypt only encrypts first 72 chars  
    */
  getUniqueTokenString(jwtToken: string) {
    const stringLen = jwtToken.length;
    return jwtToken.slice(stringLen - 72, stringLen);
  }

  async updateUserHashRt(refreshToken: string, id: number) {
    const uniqueTokenString = this.getUniqueTokenString(refreshToken);
    const hash = await this.hashData(uniqueTokenString);

    return await this.userService.updateUserHashRt(id, hash);
  }

  async githubLogin(req) {
    if (!req.user) {
      return { message: 'No user from github' };
    }

    const user = { ...req.user };
    const tokens: Tokens = { ...user?.tokens };
    // updating user hash
    const updatedUser = await this.updateUserHashRt(
      tokens.refresh_token,
      +user.id,
    );
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { hashedRt, ...safeUserdata } = updatedUser;
    return {
      user: safeUserdata,
      access_token: tokens.access_token,
    };
  }

  async login(user: UserLoginDTO): Promise<Tokens> {
    const payload = { username: user.username, sub: user.id, role: 'STUDENT' };
    const tokenDate = new Date();
    const [access_token, refresh_token] = await Promise.all([
      this.jwtService.signAsync(payload),
      this.jwtService.signAsync(
        { ...payload, tokenDate },
        {
          secret: process.env.JWT_RT_SECRET,
          expiresIn: 60 * 60 * 24,
        },
      ),
    ]);
    return {
      access_token,
      refresh_token,
    };
  }

  async getAccessFromRefreshToken(refreshToken: string, user: UserLoginDTO) {
    const dbUser = await this.userService.findUserWithId(user.id);

    if (!dbUser.hashedRt || !dbUser) {
      throw new UnauthorizedException('User logged out');
    }

    // validating user refresh token and db hash
    const isUser = await this.compareHashAndTokens(
      refreshToken,
      dbUser.hashedRt,
    );

    if (!isUser) {
      throw new UnauthorizedException('Refresh token mismatch');
    }
    const newTokens = await this.login(user);
    await this.updateUserHashRt(newTokens.refresh_token, user.id);
    return newTokens;
  }

  async compareHashAndTokens(refreshToken, hashToken) {
    const uniqueTokenString = this.getUniqueTokenString(refreshToken);
    return await bcrypt.compare(uniqueTokenString, hashToken);
  }
}
