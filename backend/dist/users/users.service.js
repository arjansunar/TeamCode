"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const prisma_service_1 = require("../prisma/prisma.service");
let UsersService = class UsersService {
    constructor(prisma, jwtService) {
        this.prisma = prisma;
        this.jwtService = jwtService;
    }
    async createUser(user) {
        return await this.prisma.user.create({
            data: user,
        });
    }
    async findUserWithId(id) {
        return await this.prisma.user.findUnique({
            where: {
                id,
            },
        });
    }
    async findUserWithPeerId(peerId) {
        return await this.prisma.user.findUnique({
            where: {
                peerId,
            },
        });
    }
    async updateUserHashRt(id, hashRt) {
        return this.prisma.user.update({
            where: {
                id,
            },
            data: {
                hashedRt: hashRt,
            },
        });
    }
    async updateUserRole(id, role) {
        const user = await this.prisma.user.update({
            where: {
                id,
            },
            data: {
                role,
            },
        });
        const payload = { username: user.username, sub: user.id, role: user.role };
        return {
            access_token: await this.jwtService.signAsync(payload),
        };
    }
    async updateUserPeerId({ id, peerId }) {
        if (!id && !peerId)
            throw new common_1.BadRequestException('User id or peer id');
        const user = await this.prisma.user.update({
            where: {
                id,
            },
            data: {
                peerId,
            },
        });
        return user;
    }
};
UsersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService, jwt_1.JwtService])
], UsersService);
exports.UsersService = UsersService;
//# sourceMappingURL=users.service.js.map