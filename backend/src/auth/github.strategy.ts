import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-github2';
import { Injectable } from '@nestjs/common';

@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy, 'github') {
  constructor() {
    super({
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: 'http://127.0.0.1:5000/auth/github/callback',
      scope: ['read:user', 'user:email'],
    });
  }
  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    const { id, username, profileUrl, emails, photos } = profile;
    const user = {
      id,
      username,
      profileUrl,
      email: emails[0].value,
      photo: photos[0].value,
      accessToken,
    };
    // console.log('user', user);
    done(null, user);
  }
}
