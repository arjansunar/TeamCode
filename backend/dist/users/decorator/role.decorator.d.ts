import { Role as UserRole } from '@prisma/client';
export declare const ROLE_KEY = "role";
export declare const Role: (role: UserRole) => import("@nestjs/common").CustomDecorator<string>;
