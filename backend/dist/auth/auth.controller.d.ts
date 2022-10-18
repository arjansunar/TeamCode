import { Response } from 'express';
import { AuthService } from './auth.service';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    githubAuth(): Promise<void>;
    githubAuthRedirect(req: any, res: Response): Promise<void>;
    refresh(req: any): Promise<{
        id: any;
        username: any;
        tokens: import("./dto").Tokens;
    }>;
    logout(req: any): Promise<any>;
}
