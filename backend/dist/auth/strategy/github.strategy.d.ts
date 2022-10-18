import { PrismaService } from 'src/prisma';
import { UsersService } from 'src/users';
declare const GithubStrategy_base: new (...args: any[]) => any;
export declare class GithubStrategy extends GithubStrategy_base {
    private prisma;
    private userService;
    constructor(prisma: PrismaService, userService: UsersService);
    validate(accessToken: string, refreshToken: string, profile: any): Promise<any>;
}
export {};
