"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Role = exports.ROLE_KEY = void 0;
const common_1 = require("@nestjs/common");
exports.ROLE_KEY = 'role';
const Role = (role) => (0, common_1.SetMetadata)(exports.ROLE_KEY, role);
exports.Role = Role;
//# sourceMappingURL=role.decorator.js.map