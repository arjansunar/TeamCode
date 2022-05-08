import { Module } from '@nestjs/common';
import { UsersModule } from 'src/users/users.module';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { GithubStrategy } from './strategy/github.strategy';
import { JwtStrategy } from './strategy';
import { AuthController } from './auth.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { JwtRtStrategy } from './strategy';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    PrismaModule,
    UsersModule,
    HttpModule,
    JwtModule.registerAsync({
      useFactory: async () => ({
        secret: process.env.JWT_SECRET,
        signOptions: {
          expiresIn: parseInt(process.env.JWT_EXPIRATION_TIME),
        },
      }),
    }),
  ],
  providers: [AuthService, GithubStrategy, JwtStrategy, JwtRtStrategy],
  exports: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
