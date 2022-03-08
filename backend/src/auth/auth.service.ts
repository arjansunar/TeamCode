import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/prisma/prisma.service';
@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService, private prisma: PrismaService) {}

  async hashData(data: string) {
    return await bcrypt.hash(data, 10);
  }

  async logout(id: number) {
    const user = this.prisma.user.updateMany({
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

  getUniqueTokenString(jwtToken: string) {
    const stringLen = jwtToken.length;
    // first 72 chars of jwt tokens are same
    // bycrypt only encrypts first 72 chars
    return jwtToken.slice(stringLen - 72, stringLen);
  }

  async updateUserHashRt(refreshToken: string, id: number) {
    const uniqueTokenString = this.getUniqueTokenString(refreshToken);
    const hash = await this.hashData(uniqueTokenString);

    return this.prisma.user.update({
      where: {
        id,
      },
      data: {
        hashedRt: hash,
      },
    });
  }

  async githubLogin(req) {
    if (!req.user) {
      return 'No user from github';
    }

    const user = { ...req.user };
    // finding the user with the id
    const dbUser = await this.prisma.user.findUnique({
      where: {
        id: parseInt(user.id),
      },
    });

    if (!dbUser) {
      // saving user
      const newUser = await this.prisma.user.create({
        data: {
          id: parseInt(user.id),
          email: user.email,
          photo: user.photo,
          profileUrl: user.profileUrl,
          username: user.username,
          // hashedRt: user.tokens.refreshToken,
          hashedRt: await this.hashData(
            this.getUniqueTokenString(user.tokens.refreshToken),
          ),
        },
      });
    } else {
      const updateUser = await this.updateUserHashRt(
        user.tokens.refreshToken,
        +user.id,
      );

      return {
        message: 'User from db',
        user: user,
      };
    }
    return {
      message: 'User info from github',
      user: user,
    };
  }

  async login(user: LoginUserDTO): Promise<Tokens> {
    const payload = { username: user.username, sub: user.id };
    const tokenDate = new Date();
    const [accessToken, refreshToken] = await Promise.all([
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
      accessToken,
      refreshToken,
    };
  }

  async getAccessFromRefreshToken(refreshToken: string, user: LoginUserDTO) {
    const dbUser = await this.prisma.user.findUnique({
      where: {
        id: user.id,
      },
    });

    if (!dbUser.hashedRt || !dbUser) {
      throw new UnauthorizedException('User logged out');
    }

    const isUser = await this.compareHashAndTokens(
      refreshToken,
      dbUser.hashedRt,
    );
    // const isUser = refreshToken == dbUser.hashedRt;
    if (!isUser) {
      throw new UnauthorizedException('Refresh token mismatch');
    }
    const newTokens = await this.login(user);
    const updatedUser = await this.updateUserHashRt(
      newTokens.refreshToken,
      user.id,
    );
    return newTokens;
  }

  async compareHashAndTokens(refreshToken, hashToken) {
    const uniqueTokenString = this.getUniqueTokenString(refreshToken);
    return await bcrypt.compare(uniqueTokenString, hashToken);
  }
}

export type LoginUserDTO = {
  id: number;
  username: string;
};

export type Tokens = {
  accessToken: string;
  refreshToken: string;
};
