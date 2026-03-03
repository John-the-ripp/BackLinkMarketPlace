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
exports.BacklinksService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const backlink_entity_js_1 = require("./entities/backlink.entity.js");
const user_entity_js_1 = require("../users/entities/user.entity.js");
let BacklinksService = class BacklinksService {
    backlinksRepository;
    dataSource;
    constructor(backlinksRepository, dataSource) {
        this.backlinksRepository = backlinksRepository;
        this.dataSource = dataSource;
    }
    async create(createBacklinkDto, sellerId) {
        const backlink = this.backlinksRepository.create({
            ...createBacklinkDto,
            sellerId,
        });
        return this.backlinksRepository.save(backlink);
    }
    async findAll() {
        return this.backlinksRepository.find({
            relations: ['seller', 'buyer'],
            order: { createdAt: 'DESC' },
        });
    }
    async findAllAvailable() {
        return this.backlinksRepository.find({
            where: { status: backlink_entity_js_1.BacklinkStatus.AVAILABLE },
            relations: ['seller'],
            order: { createdAt: 'DESC' },
        });
    }
    async findMySales(sellerId) {
        return this.backlinksRepository.find({
            where: { sellerId },
            relations: ['buyer'],
            order: { createdAt: 'DESC' },
        });
    }
    async findMyPurchases(buyerId) {
        return this.backlinksRepository.find({
            where: { buyerId },
            relations: ['seller'],
            order: { createdAt: 'DESC' },
        });
    }
    async findOne(id) {
        const backlink = await this.backlinksRepository.findOne({
            where: { id },
            relations: ['seller', 'buyer'],
        });
        if (!backlink) {
            throw new common_1.NotFoundException(`Backlink #${id} not found`);
        }
        return backlink;
    }
    async buy(id, buyerId) {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const backlink = await queryRunner.manager.findOne(backlink_entity_js_1.Backlink, {
                where: { id },
                relations: ['seller'],
            });
            if (!backlink) {
                throw new common_1.NotFoundException(`Backlink #${id} not found`);
            }
            if (backlink.status !== backlink_entity_js_1.BacklinkStatus.AVAILABLE) {
                throw new common_1.BadRequestException('This backlink is already sold');
            }
            if (backlink.sellerId === buyerId) {
                throw new common_1.BadRequestException('You cannot buy your own backlink');
            }
            const buyer = await queryRunner.manager.findOne(user_entity_js_1.User, {
                where: { id: buyerId },
            });
            if (!buyer) {
                throw new common_1.NotFoundException('Buyer not found');
            }
            const price = Number(backlink.price);
            if (Number(buyer.wallet) < price) {
                throw new common_1.BadRequestException(`Insufficient wallet balance. Required: ${price}, Available: ${buyer.wallet}`);
            }
            buyer.wallet = Number(buyer.wallet) - price;
            await queryRunner.manager.save(user_entity_js_1.User, buyer);
            const seller = await queryRunner.manager.findOne(user_entity_js_1.User, {
                where: { id: backlink.sellerId },
            });
            if (!seller) {
                throw new common_1.NotFoundException('Seller not found');
            }
            seller.wallet = Number(seller.wallet) + price;
            await queryRunner.manager.save(user_entity_js_1.User, seller);
            backlink.buyerId = buyerId;
            backlink.status = backlink_entity_js_1.BacklinkStatus.SOLD;
            const savedBacklink = await queryRunner.manager.save(backlink_entity_js_1.Backlink, backlink);
            await queryRunner.commitTransaction();
            return savedBacklink;
        }
        catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        }
        finally {
            await queryRunner.release();
        }
    }
    async update(id, updateBacklinkDto, sellerId) {
        const backlink = await this.findOne(id);
        if (backlink.sellerId !== sellerId) {
            throw new common_1.ForbiddenException('You can only update your own backlinks');
        }
        if (backlink.status === backlink_entity_js_1.BacklinkStatus.SOLD) {
            throw new common_1.BadRequestException('Cannot update a sold backlink');
        }
        Object.assign(backlink, updateBacklinkDto);
        return this.backlinksRepository.save(backlink);
    }
    async remove(id, sellerId) {
        const backlink = await this.findOne(id);
        if (backlink.sellerId !== sellerId) {
            throw new common_1.ForbiddenException('You can only delete your own backlinks');
        }
        if (backlink.status === backlink_entity_js_1.BacklinkStatus.SOLD) {
            throw new common_1.BadRequestException('Cannot delete a sold backlink');
        }
        await this.backlinksRepository.remove(backlink);
    }
};
exports.BacklinksService = BacklinksService;
exports.BacklinksService = BacklinksService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(backlink_entity_js_1.Backlink)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.DataSource])
], BacklinksService);
//# sourceMappingURL=backlinks.service.js.map