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
exports.BacklinksController = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const roles_guard_js_1 = require("../common/guards/roles.guard.js");
const roles_decorator_js_1 = require("../common/decorators/roles.decorator.js");
const role_enum_js_1 = require("../common/enums/role.enum.js");
const backlinks_service_js_1 = require("./backlinks.service.js");
const create_backlink_dto_js_1 = require("./dto/create-backlink.dto.js");
const update_backlink_dto_js_1 = require("./dto/update-backlink.dto.js");
let BacklinksController = class BacklinksController {
    backlinksService;
    constructor(backlinksService) {
        this.backlinksService = backlinksService;
    }
    create(createBacklinkDto, req) {
        return this.backlinksService.create(createBacklinkDto, req.user.id);
    }
    findAll() {
        return this.backlinksService.findAll();
    }
    findAllAvailable() {
        return this.backlinksService.findAllAvailable();
    }
    findMySales(req) {
        return this.backlinksService.findMySales(req.user.id);
    }
    findMyPurchases(req) {
        return this.backlinksService.findMyPurchases(req.user.id);
    }
    findOne(id) {
        return this.backlinksService.findOne(id);
    }
    buy(id, req) {
        return this.backlinksService.buy(id, req.user.id);
    }
    update(id, updateBacklinkDto, req) {
        return this.backlinksService.update(id, updateBacklinkDto, req.user.id);
    }
    remove(id, req) {
        return this.backlinksService.remove(id, req.user.id);
    }
};
exports.BacklinksController = BacklinksController;
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_js_1.Roles)(role_enum_js_1.Role.ANNONCEUR),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_backlink_dto_js_1.CreateBacklinkDto, Object]),
    __metadata("design:returntype", void 0)
], BacklinksController.prototype, "create", null);
__decorate([
    (0, common_1.Get)('all'),
    (0, roles_decorator_js_1.Roles)(role_enum_js_1.Role.ADMIN),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], BacklinksController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('marketplace'),
    (0, roles_decorator_js_1.Roles)(role_enum_js_1.Role.ANNONCEUR, role_enum_js_1.Role.ACHETEUR),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], BacklinksController.prototype, "findAllAvailable", null);
__decorate([
    (0, common_1.Get)('my-sales'),
    (0, roles_decorator_js_1.Roles)(role_enum_js_1.Role.ANNONCEUR),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], BacklinksController.prototype, "findMySales", null);
__decorate([
    (0, common_1.Get)('my-purchases'),
    (0, roles_decorator_js_1.Roles)(role_enum_js_1.Role.ACHETEUR),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], BacklinksController.prototype, "findMyPurchases", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, roles_decorator_js_1.Roles)(role_enum_js_1.Role.ANNONCEUR, role_enum_js_1.Role.ACHETEUR),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], BacklinksController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(':id/buy'),
    (0, roles_decorator_js_1.Roles)(role_enum_js_1.Role.ACHETEUR),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", void 0)
], BacklinksController.prototype, "buy", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, roles_decorator_js_1.Roles)(role_enum_js_1.Role.ANNONCEUR),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_backlink_dto_js_1.UpdateBacklinkDto, Object]),
    __metadata("design:returntype", void 0)
], BacklinksController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_js_1.Roles)(role_enum_js_1.Role.ANNONCEUR),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", void 0)
], BacklinksController.prototype, "remove", null);
exports.BacklinksController = BacklinksController = __decorate([
    (0, common_1.Controller)('backlinks'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), roles_guard_js_1.RolesGuard),
    __metadata("design:paramtypes", [backlinks_service_js_1.BacklinksService])
], BacklinksController);
//# sourceMappingURL=backlinks.controller.js.map