import { SetMetadata } from '@nestjs/common';
import { Role as UserRole } from '@prisma/client';

export const ROLE_KEY = 'role';
export const Role = (role: UserRole) => SetMetadata(ROLE_KEY, role);
