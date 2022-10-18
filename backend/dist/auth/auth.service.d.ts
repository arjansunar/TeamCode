import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma';
import { UsersService } from 'src/users';
import { Tokens, UserLoginDTO } from './dto';
export declare class AuthService {
    private jwtService;
    private prisma;
    private userService;
    constructor(jwtService: JwtService, prisma: PrismaService, userService: UsersService);
    hashData(data: string): Promise<string>;
    logout(id: number): Promise<any>;
    getUniqueTokenString(jwtToken: string): string;
    updateUserHashRt(refreshToken: string, id: number): Promise<import(".prisma/client").User>;
    githubLogin(req: any): Promise<{
        message: string;
        user?: undefined;
        access_token?: undefined;
    } | {
        user: {
            id: number;
            username: string;
            photo: string;
            createdAt: Date;
            updatedAt: Date;
            email: string;
            role: import(".prisma/client").Role;
            peerId: string;
            meetingId: string;
        };
        access_token: string;
        message?: undefined;
    }>;
    login(user: UserLoginDTO): Promise<Tokens>;
    getAccessFromRefreshToken(refreshToken: string, user: UserLoginDTO): Promise<Tokens>;
    compareHashAndTokens(refreshToken: any, hashToken: any): Promise<boolean>;
}
