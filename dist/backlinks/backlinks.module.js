"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BacklinksModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const backlink_entity_js_1 = require("./entities/backlink.entity.js");
const backlinks_service_js_1 = require("./backlinks.service.js");
const backlinks_controller_js_1 = require("./backlinks.controller.js");
let BacklinksModule = class BacklinksModule {
};
exports.BacklinksModule = BacklinksModule;
exports.BacklinksModule = BacklinksModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([backlink_entity_js_1.Backlink])],
        controllers: [backlinks_controller_js_1.BacklinksController],
        providers: [backlinks_service_js_1.BacklinksService],
        exports: [backlinks_service_js_1.BacklinksService],
    })
], BacklinksModule);
//# sourceMappingURL=backlinks.module.js.map