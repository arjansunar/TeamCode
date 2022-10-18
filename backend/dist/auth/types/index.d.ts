import { Role } from '@prisma/client';
export declare type ParsedJWTToken = {
    id: number;
    username: string;
    role: Role;
};
