import { JwtService } from '@nestjs/jwt';
import { Role } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserCreateDTO } from './dto/user-create.dto';
export declare class UsersService {
    private prisma;
    private jwtService;
    constructor(prisma: PrismaService, jwtService: JwtService);
    createUser(user: UserCreateDTO): Promise<import(".prisma/client").User>;
    findUserWithId(id: number): Promise<import(".prisma/client").User>;
    findUserWithPeerId(peerId: string): Promise<import(".prisma/client").User>;
    updateUserHashRt(id: number, hashRt: string): Promise<import(".prisma/client").User>;
    updateUserRole(id: any, role: Role): Promise<{
        access_token: string;
    }>;
    updateUserPeerId({ id, peerId }: {
        id: number;
        peerId: string;
    }): Promise<import(".prisma/client").User>;
}
