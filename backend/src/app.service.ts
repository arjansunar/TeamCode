import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  githubLogin(req) {
    if (!req.user) {
      return 'No user from github';
    }
    return {
      message: 'User info from github',
      user: req.user,
    };
  }
}
