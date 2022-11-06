"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const swagger_1 = require("@nestjs/swagger");
const cookieParser = require("cookie-parser");
const app_module_1 = require("./app.module");
const jwt_auth_guard_1 = require("./auth/guard/jwt-auth.guard");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const options = {
        origin: ['*', 'http://localhost:3000'],
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
        preflightContinue: false,
        optionsSuccessStatus: 204,
        credentials: true,
    };
    app.enableCors(options);
    app.use(cookieParser());
    const reflector = app.get(core_1.Reflector);
    app.useGlobalGuards(new jwt_auth_guard_1.JwtAuthGuard(reflector));
    const config = new swagger_1.DocumentBuilder()
        .setTitle('TeamCode Api')
        .setDescription('The TeamCode API')
        .setVersion('1.0')
        .addBearerAuth({
        type: 'http',
        description: 'access token',
        scheme: 'bearer',
        bearerFormat: 'JWT',
    }, 'JWT')
        .addBearerAuth({
        type: 'http',
        description: 'refresh token',
        scheme: 'bearer',
        bearerFormat: 'JWT',
    }, 'JWT-RT')
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('api', app, document);
    await app.listen(process.env.port || 5000);
}
bootstrap();
//# sourceMappingURL=main.js.map