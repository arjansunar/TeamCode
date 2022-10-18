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
exports.UsersController = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const get_user_decorator_1 = require("../auth/decorator/get-user.decorator");
const user_loggin_guard_1 = require("../auth/guard/user-loggin.guard");
const role_decorator_1 = require("./decorator/role.decorator");
const dto_1 = require("./dto");
const role_guard_1 = require("./guard/role.guard");
const users_service_1 = require("./users.service");
let UsersController = class UsersController {
    constructor(usersService) {
        this.usersService = usersService;
    }
    async isLoggedIn(id) {
        const user = await this.usersService.findUserWithId(id);
        return { isLoggedIn: !!user && !!user.hashedRt };
    }
    async getMe(user) {
        return user;
    }
    async updateUserRole(user, userRoleDto) {
        return this.usersService.updateUserRole(user.id, userRoleDto.role);
    }
    protectedTeacherOnlyRoute() {
        return 'You are a teacher ';
    }
};
__decorate([
    (0, common_1.Get)('/is-logged-in'),
    __param(0, (0, get_user_decorator_1.GetUser)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "isLoggedIn", null);
__decorate([
    (0, common_1.Get)('/me'),
    __param(0, (0, get_user_decorator_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getMe", null);
__decorate([
    (0, common_1.Post)('/role'),
    __param(0, (0, get_user_decorator_1.GetUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, dto_1.UserRoleDTO]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "updateUserRole", null);
__decorate([
    (0, common_1.Get)('/teacher'),
    (0, role_decorator_1.Role)(client_1.Role.TEACHER),
    (0, common_1.UseGuards)(role_guard_1.RoleGuard),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "protectedTeacherOnlyRoute", null);
UsersController = __decorate([
    (0, common_1.Controller)('users'),
    (0, common_1.UseGuards)(user_loggin_guard_1.UserLoggedGuard),
    __metadata("design:paramtypes", [users_service_1.UsersService])
], UsersController);
exports.UsersController = UsersController;
//# sourceMappingURL=users.controller.js.map