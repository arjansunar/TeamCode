import { Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
declare const JwtRtStrategy_base: new (...args: any[]) => Strategy;
export declare class JwtRtStrategy extends JwtRtStrategy_base {
    private configService;
    constructor(configService: ConfigService);
    validate(req: Request, payload: any): Promise<{
        id: any;
        username: any;
        refresh_token: string;
    }>;
}
export {};
