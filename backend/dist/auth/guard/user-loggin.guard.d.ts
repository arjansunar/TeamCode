import { CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import { PrismaService } from 'src/prisma/prisma.service';
export declare class UserLoggedGuard implements CanActivate {
    private prisma;
    constructor(prisma: PrismaService);
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean>;
    findUser(id: any): Promise<boolean>;
}
