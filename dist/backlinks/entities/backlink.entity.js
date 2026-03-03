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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Backlink = exports.BacklinkStatus = void 0;
const typeorm_1 = require("typeorm");
const user_entity_js_1 = require("../../users/entities/user.entity.js");
var BacklinkStatus;
(function (BacklinkStatus) {
    BacklinkStatus["AVAILABLE"] = "available";
    BacklinkStatus["SOLD"] = "sold";
})(BacklinkStatus || (exports.BacklinkStatus = BacklinkStatus = {}));
let Backlink = class Backlink {
    id;
    url;
    anchorText;
    targetUrl;
    price;
    status;
    seller;
    sellerId;
    buyer;
    buyerId;
    createdAt;
    updatedAt;
};
exports.Backlink = Backlink;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Backlink.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Backlink.prototype, "url", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Backlink.prototype, "anchorText", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Backlink.prototype, "targetUrl", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], Backlink.prototype, "price", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: BacklinkStatus, default: BacklinkStatus.AVAILABLE }),
    __metadata("design:type", String)
], Backlink.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_js_1.User),
    __metadata("design:type", user_entity_js_1.User)
], Backlink.prototype, "seller", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Backlink.prototype, "sellerId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_js_1.User, { nullable: true }),
    __metadata("design:type", user_entity_js_1.User)
], Backlink.prototype, "buyer", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Number)
], Backlink.prototype, "buyerId", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Backlink.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Backlink.prototype, "updatedAt", void 0);
exports.Backlink = Backlink = __decorate([
    (0, typeorm_1.Entity)('backlinks')
], Backlink);
//# sourceMappingURL=backlink.entity.js.map