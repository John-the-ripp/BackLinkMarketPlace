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
const typeorm_1 = require("@nestjs/typeorm");
const auth_module_js_1 = require("./auth/auth.module.js");
const users_module_js_1 = require("./users/users.module.js");
const backlinks_module_js_1 = require("./backlinks/backlinks.module.js");
const user_entity_js_1 = require("./users/entities/user.entity.js");
const backlink_entity_js_1 = require("./backlinks/entities/backlink.entity.js");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forRoot({
                type: 'postgres',
                url: process.env.DATABASE_URL || 'postgresql://neondb_owner:npg_KpbkU4Dnyfr0@ep-royal-truth-al41kx4x-pooler.c-3.eu-central-1.aws.neon.tech/neondb?sslmode=require',
                ssl: true,
                entities: [user_entity_js_1.User, backlink_entity_js_1.Backlink],
                synchronize: true,
            }),
            auth_module_js_1.AuthModule,
            users_module_js_1.UsersModule,
            backlinks_module_js_1.BacklinksModule,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map