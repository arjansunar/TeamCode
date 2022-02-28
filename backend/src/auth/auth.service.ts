import { Injectable } from '@nestjs/common';
import { User, UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

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
