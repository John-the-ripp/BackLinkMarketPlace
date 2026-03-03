import { BacklinksService } from './backlinks.service.js';
import { CreateBacklinkDto } from './dto/create-backlink.dto.js';
import { UpdateBacklinkDto } from './dto/update-backlink.dto.js';
export declare class BacklinksController {
    private backlinksService;
    constructor(backlinksService: BacklinksService);
    create(createBacklinkDto: CreateBacklinkDto, req: any): Promise<import("./entities/backlink.entity.js").Backlink>;
    findAll(): Promise<import("./entities/backlink.entity.js").Backlink[]>;
    findAllAvailable(): Promise<import("./entities/backlink.entity.js").Backlink[]>;
    findMySales(req: any): Promise<import("./entities/backlink.entity.js").Backlink[]>;
    findMyPurchases(req: any): Promise<import("./entities/backlink.entity.js").Backlink[]>;
    findOne(id: number): Promise<import("./entities/backlink.entity.js").Backlink>;
    buy(id: number, req: any): Promise<import("./entities/backlink.entity.js").Backlink>;
    update(id: number, updateBacklinkDto: UpdateBacklinkDto, req: any): Promise<import("./entities/backlink.entity.js").Backlink>;
    remove(id: number, req: any): Promise<void>;
}
