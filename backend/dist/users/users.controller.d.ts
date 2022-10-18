import { ParsedJWTToken } from 'src/auth/types';
import { UserRoleDTO } from './dto';
import { UsersService } from './users.service';
export declare class UsersController {
    private usersService;
    constructor(usersService: UsersService);
    isLoggedIn(id: number): Promise<{
        isLoggedIn: boolean;
    }>;
    getMe(user: any): Promise<any>;
    updateUserRole(user: ParsedJWTToken, userRoleDto: UserRoleDTO): Promise<{
        access_token: string;
    }>;
    protectedTeacherOnlyRoute(): string;
}
