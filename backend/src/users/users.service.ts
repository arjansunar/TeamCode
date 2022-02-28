import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

// This should be a real class/interface representing a user entity
export type User = {
  id: string;
  username: string;
  profileUrl: string;
  email: string;
  photo: string;
};

@Injectable()
export class UsersService {
  // async saveUser(data: Prisma.UserCreateInput){
}
