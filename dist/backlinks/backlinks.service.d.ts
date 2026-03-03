import { Repository, DataSource } from 'typeorm';
import { Backlink } from './entities/backlink.entity.js';
import { CreateBacklinkDto } from './dto/create-backlink.dto.js';
import { UpdateBacklinkDto } from './dto/update-backlink.dto.js';
export declare class BacklinksService {
    private backlinksRepository;
    private dataSource;
    constructor(backlinksRepository: Repository<Backlink>, dataSource: DataSource);
    create(createBacklinkDto: CreateBacklinkDto, sellerId: number): Promise<Backlink>;
    findAll(): Promise<Backlink[]>;
    findAllAvailable(): Promise<Backlink[]>;
    findMySales(sellerId: number): Promise<Backlink[]>;
    findMyPurchases(buyerId: number): Promise<Backlink[]>;
    findOne(id: number): Promise<Backlink>;
    buy(id: number, buyerId: number): Promise<Backlink>;
    update(id: number, updateBacklinkDto: UpdateBacklinkDto, sellerId: number): Promise<Backlink>;
    remove(id: number, sellerId: number): Promise<void>;
}
