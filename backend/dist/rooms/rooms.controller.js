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
exports.RoomsController = void 0;
const common_1 = require("@nestjs/common");
const user_loggin_guard_1 = require("../auth/guard/user-loggin.guard");
const role_decorator_1 = require("../users/decorator/role.decorator");
const client_1 = require("@prisma/client");
const role_guard_1 = require("../users/guard/role.guard");
const rooms_service_1 = require("./rooms.service");
const get_user_decorator_1 = require("../auth/decorator/get-user.decorator");
let RoomsController = class RoomsController {
    constructor(roomsService) {
        this.roomsService = roomsService;
    }
    async createRoom(ownerId) {
        return await this.roomsService.createNewRoom(ownerId);
    }
    async getOwnerRoom(ownerId) {
        return await this.roomsService.getRoomByOwnerId(ownerId);
    }
    async endMeeting(roomId) {
        return await this.roomsService.deleteRoom(roomId);
    }
    async getRoomDetails(roomId) {
        console.log('hya aayo', roomId);
        return await this.roomsService.getRoom(roomId);
    }
    async addMember(roomId, memberId) {
        return await this.roomsService.addMembers(roomId, memberId);
    }
};
__decorate([
    (0, common_1.Post)('/generate'),
    (0, role_decorator_1.Role)(client_1.Role.TEACHER),
    (0, common_1.UseGuards)(role_guard_1.RoleGuard),
    __param(0, (0, get_user_decorator_1.GetUser)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], RoomsController.prototype, "createRoom", null);
__decorate([
    (0, common_1.Get)('/my-room'),
    (0, role_decorator_1.Role)(client_1.Role.TEACHER),
    (0, common_1.UseGuards)(role_guard_1.RoleGuard),
    __param(0, (0, get_user_decorator_1.GetUser)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], RoomsController.prototype, "getOwnerRoom", null);
__decorate([
    (0, common_1.Delete)('/end-meeting'),
    (0, role_decorator_1.Role)(client_1.Role.TEACHER),
    (0, common_1.UseGuards)(role_guard_1.RoleGuard),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], RoomsController.prototype, "endMeeting", null);
__decorate([
    (0, common_1.Get)('/room-details/:roomId'),
    __param(0, (0, common_1.Param)('roomId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], RoomsController.prototype, "getRoomDetails", null);
__decorate([
    (0, common_1.Post)('/add-member/:roomId'),
    __param(0, (0, common_1.Param)('roomId')),
    __param(1, (0, get_user_decorator_1.GetUser)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], RoomsController.prototype, "addMember", null);
RoomsController = __decorate([
    (0, common_1.Controller)('rooms'),
    (0, common_1.UseGuards)(user_loggin_guard_1.UserLoggedGuard),
    __metadata("design:paramtypes", [rooms_service_1.RoomsService])
], RoomsController);
exports.RoomsController = RoomsController;
//# sourceMappingURL=rooms.controller.js.map