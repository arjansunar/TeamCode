import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';

@Injectable()
export class AppService {
  async getHello(): Promise<string> {
    return 'hello';
  }
}
