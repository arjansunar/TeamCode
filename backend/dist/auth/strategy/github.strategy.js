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
exports.GithubStrategy = void 0;
const passport_1 = require("@nestjs/passport");
const passport_github2_1 = require("passport-github2");
const common_1 = require("@nestjs/common");
const prisma_1 = require("../../prisma");
const users_1 = require("../../users");
let GithubStrategy = class GithubStrategy extends (0, passport_1.PassportStrategy)(passport_github2_1.Strategy, 'github') {
    constructor(prisma, userService) {
        super({
            clientID: process.env.GITHUB_CLIENT_ID,
            clientSecret: process.env.GITHUB_CLIENT_SECRET,
            callbackURL: 'http://127.0.0.1:5000/auth/github/callback',
            scope: ['read:user', 'user:email'],
        });
        this.prisma = prisma;
        this.userService = userService;
    }
    async validate(accessToken, refreshToken, profile) {
        const { id, username, profileUrl, emails, photos } = profile;
        const user = {
            id: parseInt(id),
            username,
            email: emails[0].value,
            photo: photos[0].value,
        };
        const dbUser = await this.userService.findUserWithId(user.id);
        if (!dbUser) {
            const newUser = Object.assign(Object.assign({}, user), { hashedRt: null });
            return await this.userService.createUser(newUser);
        }
        return dbUser;
    }
};
GithubStrategy = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_1.PrismaService,
        users_1.UsersService])
], GithubStrategy);
exports.GithubStrategy = GithubStrategy;
//# sourceMappingURL=github.strategy.js.map