import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserLoggedGuard implements CanActivate {
  constructor(private prisma: PrismaService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const { user } = context.switchToHttp().getRequest();

    return this.findUser(+user.id);
  }

  async findUser(id) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: id,
      },
    });
    if (!user.hashedRt) {
      throw new UnauthorizedException('User has logged out!!');
    }

    return true;
  }
}
