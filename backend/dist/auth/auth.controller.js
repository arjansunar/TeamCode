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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const swagger_1 = require("@nestjs/swagger");
const auth_service_1 = require("./auth.service");
const public_decorator_1 = require("./decorator/public.decorator");
const jwt_rt_guard_1 = require("./guard/jwt-rt.guard");
const user_loggin_guard_1 = require("./guard/user-loggin.guard");
let AuthController = class AuthController {
    constructor(authService) {
        this.authService = authService;
    }
    async githubAuth() { }
    async githubAuthRedirect(req, res) {
        req.user.tokens = await this.authService.login(req.user);
        const authData = JSON.stringify(await this.authService.githubLogin(Object.assign({}, req)));
        res.redirect(`http://localhost:3000/login?auth_data=${authData}`);
    }
    async refresh(req) {
        const { id, username } = req.user;
        const user = {
            id: +id,
            username,
        };
        const refresh_token = req.user.refresh_token;
        const tokens = await this.authService.getAccessFromRefreshToken(refresh_token, user);
        return {
            id,
            username,
            tokens,
        };
    }
    async logout(req) {
        return await this.authService.logout(+req.user.id);
    }
};
__decorate([
    (0, common_1.Get)('/'),
    (0, public_decorator_1.Public)(),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('github')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "githubAuth", null);
__decorate([
    (0, common_1.Get)('/github/callback'),
    (0, public_decorator_1.Public)(),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('github')),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "githubAuthRedirect", null);
__decorate([
    (0, common_1.Get)('/refresh'),
    (0, public_decorator_1.Public)(),
    (0, common_1.UseGuards)(jwt_rt_guard_1.JwtRefreshAuthGuard),
    (0, swagger_1.ApiBearerAuth)('JWT-RT'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "refresh", null);
__decorate([
    (0, common_1.Get)('/logout'),
    (0, swagger_1.ApiBearerAuth)('JWT'),
    (0, common_1.UseGuards)(user_loggin_guard_1.UserLoggedGuard),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "logout", null);
AuthController = __decorate([
    (0, common_1.Controller)('auth'),
    (0, swagger_1.ApiTags)('Authentication route'),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], AuthController);
exports.AuthController = AuthController;
//# sourceMappingURL=auth.controller.js.map