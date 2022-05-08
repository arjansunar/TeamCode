import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-github2';
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma';
import { UserCreateDTO } from 'src/users/dto';
import { UsersService } from 'src/users';

@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy, 'github') {
  constructor(
    private prisma: PrismaService,
    private userService: UsersService,
  ) {
    super({
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: 'http://127.0.0.1:5000/auth/github/callback',

      // callbackURL: 'http://localhost:3000/login',
      scope: ['read:user', 'user:email'],
    });
  }
  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
  ): Promise<any> {
    const { id, username, profileUrl, emails, photos } = profile;
    const user = {
      id: parseInt(id),
      username,
      email: emails[0].value,
      photo: photos[0].value,
    };

    // finding dbuser
    const dbUser = await this.userService.findUserWithId(user.id);

    if (!dbUser) {
      // saving user
      const newUser: UserCreateDTO = { ...user, hashedRt: null };
      return await this.userService.createUser(newUser);
    }

    return dbUser;
  }
}
