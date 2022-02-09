import { Injectable } from '@nestjs/common';
import { User, UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  // async validateUser(id: string, email: string): Promise<User | null> {
  //   const user = await this.usersService.findOne(id);
  //   if (user && user.email === email) {
  //     const { ...result } = user;
  //     return result;
  //   }
  //   return null;
  // }
  async login(user: User) {
    const payload = { username: user.username, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
