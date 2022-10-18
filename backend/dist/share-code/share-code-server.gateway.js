"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShareCodeServerGateway = void 0;
const common_1 = require("@nestjs/common");
const websockets_1 = require("@nestjs/websockets");
let ShareCodeServerGateway = class ShareCodeServerGateway {
    constructor() {
        this.Rooms = {};
        this.logger = new common_1.Logger('AppGateway');
    }
    afterInit(server) {
        this.logger.log('Initialized share code server');
    }
};
ShareCodeServerGateway = __decorate([
    (0, websockets_1.WebSocketGateway)(5002, {
        cors: {
            origin: '*',
        },
    })
], ShareCodeServerGateway);
exports.ShareCodeServerGateway = ShareCodeServerGateway;
//# sourceMappingURL=share-code-server.gateway.js.map