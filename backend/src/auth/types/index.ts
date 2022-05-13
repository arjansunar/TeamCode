import { Role } from '@prisma/client';

export type ParsedJWTToken = {
  id: number;
  username: string;
  role: Role;
};
