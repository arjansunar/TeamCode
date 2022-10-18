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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const bcrypt = require("bcrypt");
const prisma_1 = require("../prisma");
const users_1 = require("../users");
let AuthService = class AuthService {
    constructor(jwtService, prisma, userService) {
        this.jwtService = jwtService;
        this.prisma = prisma;
        this.userService = userService;
    }
    async hashData(data) {
        return await bcrypt.hash(data, 10);
    }
    async logout(id) {
        const user = await this.prisma.user.updateMany({
            where: {
                id,
                hashedRt: {
                    not: null,
                },
            },
            data: {
                hashedRt: null,
            },
        });
        return user[0];
    }
    getUniqueTokenString(jwtToken) {
        const stringLen = jwtToken.length;
        return jwtToken.slice(stringLen - 72, stringLen);
    }
    async updateUserHashRt(refreshToken, id) {
        const uniqueTokenString = this.getUniqueTokenString(refreshToken);
        const hash = await this.hashData(uniqueTokenString);
        return await this.userService.updateUserHashRt(id, hash);
    }
    async githubLogin(req) {
        if (!req.user) {
            return { message: 'No user from github' };
        }
        const user = Object.assign({}, req.user);
        const tokens = Object.assign({}, user === null || user === void 0 ? void 0 : user.tokens);
        const updatedUser = await this.updateUserHashRt(tokens.refresh_token, +user.id);
        const { hashedRt } = updatedUser, safeUserdata = __rest(updatedUser, ["hashedRt"]);
        return {
            user: safeUserdata,
            access_token: tokens.access_token,
        };
    }
    async login(user) {
        const payload = { username: user.username, sub: user.id, role: 'STUDENT' };
        const tokenDate = new Date();
        const [access_token, refresh_token] = await Promise.all([
            this.jwtService.signAsync(payload),
            this.jwtService.signAsync(Object.assign(Object.assign({}, payload), { tokenDate }), {
                secret: process.env.JWT_RT_SECRET,
                expiresIn: 60 * 60 * 24,
            }),
        ]);
        return {
            access_token,
            refresh_token,
        };
    }
    async getAccessFromRefreshToken(refreshToken, user) {
        const dbUser = await this.userService.findUserWithId(user.id);
        if (!dbUser.hashedRt || !dbUser) {
            throw new common_1.UnauthorizedException('User logged out');
        }
        const isUser = await this.compareHashAndTokens(refreshToken, dbUser.hashedRt);
        if (!isUser) {
            throw new common_1.UnauthorizedException('Refresh token mismatch');
        }
        const newTokens = await this.login(user);
        await this.updateUserHashRt(newTokens.refresh_token, user.id);
        return newTokens;
    }
    async compareHashAndTokens(refreshToken, hashToken) {
        const uniqueTokenString = this.getUniqueTokenString(refreshToken);
        return await bcrypt.compare(uniqueTokenString, hashToken);
    }
};
AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [jwt_1.JwtService,
        prisma_1.PrismaService,
        users_1.UsersService])
], AuthService);
exports.AuthService = AuthService;
//# sourceMappingURL=auth.service.js.map