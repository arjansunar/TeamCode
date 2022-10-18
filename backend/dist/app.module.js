"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const auth_module_1 = require("./auth/auth.module");
const users_module_1 = require("./users/users.module");
const config_1 = require("@nestjs/config");
const prisma_module_1 = require("./prisma/prisma.module");
const core_1 = require("@nestjs/core");
const jwt_auth_guard_1 = require("./auth/guard/jwt-auth.guard");
const signall_server_module_1 = require("./signall-server/signall-server.module");
const rooms_module_1 = require("./rooms/rooms.module");
const share_code_server_gateway_1 = require("./share-code/share-code-server.gateway");
const app_controller_1 = require("./app.controller");
let AppModule = class AppModule {
};
AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
            }),
            auth_module_1.AuthModule,
            users_module_1.UsersModule,
            prisma_module_1.PrismaModule,
            signall_server_module_1.SignallServerModule,
            rooms_module_1.RoomsModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [
            {
                provide: core_1.APP_GUARD,
                useClass: jwt_auth_guard_1.JwtAuthGuard,
            },
            share_code_server_gateway_1.ShareCodeServerGateway,
        ],
    })
], AppModule);
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map