import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Role } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserCreateDTO } from './dto/user-create.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService, private jwtService: JwtService) {}

  // creating user in the db
  async createUser(user: UserCreateDTO) {
    return await this.prisma.user.create({
      data: user,
    });
  }

  // find user with its unique identifiers
  async findUserWithId(id: number) {
    return await this.prisma.user.findUnique({
      where: {
        id,
      },
    });
  }

  // updates user hashed refresh tokens
  async updateUserHashRt(id: number, hashRt: string) {
    return this.prisma.user.update({
      where: {
        id,
      },
      data: {
        hashedRt: hashRt,
      },
    });
  }

  // update user role
  async updateUserRole(id, role: Role) {
    const user = await this.prisma.user.update({
      where: {
        id,
      },
      data: {
        role,
      },
    });

    // get new token
    const payload = { username: user.username, sub: user.id, role: user.role };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
