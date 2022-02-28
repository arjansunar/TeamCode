import { Injectable } from '@nestjs/common';
import { User, UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/prisma/prisma.service';
@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private prisma: PrismaService,
  ) {}

  async hashData(data: string) {
    return await bcrypt.hash(data, 10);
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
          hashedRt: await this.hashData(user.tokens.refreshToken),
        },
      });
    } else {
      return {
        message: 'User from db',
        user: req.user,
      };
    }
    return {
      message: 'User info from github',
      user: req.user,
    };
  }

  async login(user: User) {
    const payload = { username: user.username, sub: user.id };
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload),
      this.jwtService.signAsync(payload, {
        secret: process.env.JWT_RT_SECRET,
        expiresIn: 60 * 60 * 24,
      }),
    ]);
    return {
      accessToken,
      refreshToken,
    };
  }
}
