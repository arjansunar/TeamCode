import { Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { ParsedJWTToken } from '../types';
declare const JwtStrategy_base: new (...args: any[]) => Strategy;
export declare class JwtStrategy extends JwtStrategy_base {
    private configService;
    constructor(configService: ConfigService);
    private static extractJWT;
    validate(payload: any): Promise<ParsedJWTToken>;
}
export {};
