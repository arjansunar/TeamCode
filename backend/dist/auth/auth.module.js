"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthModule = void 0;
const common_1 = require("@nestjs/common");
const users_module_1 = require("../users/users.module");
const auth_service_1 = require("./auth.service");
const jwt_1 = require("@nestjs/jwt");
const github_strategy_1 = require("./strategy/github.strategy");
const strategy_1 = require("./strategy");
const auth_controller_1 = require("./auth.controller");
const prisma_module_1 = require("../prisma/prisma.module");
const strategy_2 = require("./strategy");
const axios_1 = require("@nestjs/axios");
let AuthModule = class AuthModule {
};
AuthModule = __decorate([
    (0, common_1.Module)({
        imports: [
            prisma_module_1.PrismaModule,
            users_module_1.UsersModule,
            axios_1.HttpModule,
            jwt_1.JwtModule.registerAsync({
                useFactory: async () => ({
                    secret: process.env.JWT_SECRET,
                    signOptions: {
                        expiresIn: parseInt(process.env.JWT_EXPIRATION_TIME),
                    },
                }),
            }),
        ],
        providers: [auth_service_1.AuthService, github_strategy_1.GithubStrategy, strategy_1.JwtStrategy, strategy_2.JwtRtStrategy],
        exports: [auth_service_1.AuthService],
        controllers: [auth_controller_1.AuthController],
    })
], AuthModule);
exports.AuthModule = AuthModule;
//# sourceMappingURL=auth.module.js.map