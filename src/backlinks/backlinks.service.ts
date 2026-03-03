import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Backlink, BacklinkStatus } from './entities/backlink.entity.js';
import { User } from '../users/entities/user.entity.js';
import { AgcClient } from '../agc/entities/agc-client.entity.js';
import { AgcService } from '../agc/agc.service.js';
import { Role } from '../common/enums/role.enum.js';
import { CreateBacklinkDto } from './dto/create-backlink.dto.js';
import { UpdateBacklinkDto } from './dto/update-backlink.dto.js';

@Injectable()
export class BacklinksService {
  constructor(
    @InjectRepository(Backlink)
    private backlinksRepository: Repository<Backlink>,
    private dataSource: DataSource,
    private agcService: AgcService,
  ) {}

  // ── VENDRE : mettre un backlink en vente ──
  async create(createBacklinkDto: CreateBacklinkDto, sellerId: number): Promise<Backlink> {
    const backlink = this.backlinksRepository.create({
      ...createBacklinkDto,
      sellerId,
    });

    return this.backlinksRepository.save(backlink);
  }

  // ── ADMIN : tous les backlinks ──
  async findAll(): Promise<Backlink[]> {
    return this.backlinksRepository.find({
      relations: ['seller', 'buyer'],
      order: { createdAt: 'DESC' },
    });
  }

  // ── MARKETPLACE : tous les backlinks disponibles ──
  async findAllAvailable(): Promise<Backlink[]> {
    return this.backlinksRepository.find({
      where: { status: BacklinkStatus.AVAILABLE },
      relations: ['seller'],
      order: { createdAt: 'DESC' },
    });
  }

  // ── Mes backlinks en vente ──
  async findMySales(sellerId: number): Promise<Backlink[]> {
    return this.backlinksRepository.find({
      where: { sellerId },
      relations: ['buyer'],
      order: { createdAt: 'DESC' },
    });
  }

  // ── Mes achats ──
  async findMyPurchases(buyerId: number): Promise<Backlink[]> {
    return this.backlinksRepository.find({
      where: { buyerId },
      relations: ['seller'],
      order: { createdAt: 'DESC' },
    });
  }

  // ── Détail d'un backlink ──
  async findOne(id: number): Promise<Backlink> {
    const backlink = await this.backlinksRepository.findOne({
      where: { id },
      relations: ['seller', 'buyer'],
    });

    if (!backlink) {
      throw new NotFoundException(`Backlink #${id} not found`);
    }

    return backlink;
  }

  // ── ACHETER un backlink (avec transaction wallet) ──
  async buy(id: number, buyerId: number, clientId?: number): Promise<Backlink> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const backlink = await queryRunner.manager.findOne(Backlink, {
        where: { id },
        relations: ['seller'],
      });

      if (!backlink) {
        throw new NotFoundException(`Backlink #${id} not found`);
      }

      if (backlink.status !== BacklinkStatus.AVAILABLE) {
        throw new BadRequestException('This backlink is already sold');
      }

      if (backlink.sellerId === buyerId) {
        throw new BadRequestException('You cannot buy your own backlink');
      }

      const buyer = await queryRunner.manager.findOne(User, {
        where: { id: buyerId },
      });

      if (!buyer) {
        throw new NotFoundException('Buyer not found');
      }

      const price = Number(backlink.price);

      // ── Achat pour un client AGC ──
      if (clientId) {
        if (buyer.role !== Role.AGC && buyer.role !== Role.AGC_SUB) {
          throw new BadRequestException('Only AGC users can specify a clientId');
        }

        // Valider l'accès au client (permissions)
        await this.agcService.validateClientPurchase(buyerId, buyer.role, clientId);

        // Re-charger le client dans la transaction
        const client = await queryRunner.manager.findOne(AgcClient, {
          where: { id: clientId },
        });

        if (!client) {
          throw new NotFoundException(`Client #${clientId} not found`);
        }

        if (Number(client.wallet) < price) {
          throw new BadRequestException(
            `Insufficient client wallet. Required: ${price}, Available: ${client.wallet}`,
          );
        }

        // Débiter le wallet du client
        client.wallet = Number(client.wallet) - price;
        await queryRunner.manager.save(AgcClient, client);

        backlink.clientId = clientId;

      // ── Achat personnel (ACHETEUR classique) ──
      } else {
        if (buyer.role === Role.AGC || buyer.role === Role.AGC_SUB) {
          throw new BadRequestException('AGC users must specify a clientId when purchasing');
        }

        if (Number(buyer.wallet) < price) {
          throw new BadRequestException(
            `Insufficient wallet balance. Required: ${price}, Available: ${buyer.wallet}`,
          );
        }

        buyer.wallet = Number(buyer.wallet) - price;
        await queryRunner.manager.save(User, buyer);
      }

      // Créditer le vendeur
      const seller = await queryRunner.manager.findOne(User, {
        where: { id: backlink.sellerId },
      });

      if (!seller) {
        throw new NotFoundException('Seller not found');
      }

      seller.wallet = Number(seller.wallet) + price;
      await queryRunner.manager.save(User, seller);

      // Marquer le backlink comme vendu
      backlink.buyerId = buyerId;
      backlink.status = BacklinkStatus.SOLD;
      const savedBacklink = await queryRunner.manager.save(Backlink, backlink);

      await queryRunner.commitTransaction();

      return savedBacklink;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  // ── Modifier son backlink (vendeur uniquement) ──
  async update(id: number, updateBacklinkDto: UpdateBacklinkDto, sellerId: number): Promise<Backlink> {
    const backlink = await this.findOne(id);

    if (backlink.sellerId !== sellerId) {
      throw new ForbiddenException('You can only update your own backlinks');
    }

    if (backlink.status === BacklinkStatus.SOLD) {
      throw new BadRequestException('Cannot update a sold backlink');
    }

    Object.assign(backlink, updateBacklinkDto);
    return this.backlinksRepository.save(backlink);
  }

  // ── Supprimer son backlink (vendeur uniquement) ──
  async remove(id: number, sellerId: number): Promise<void> {
    const backlink = await this.findOne(id);

    if (backlink.sellerId !== sellerId) {
      throw new ForbiddenException('You can only delete your own backlinks');
    }

    if (backlink.status === BacklinkStatus.SOLD) {
      throw new BadRequestException('Cannot delete a sold backlink');
    }

    await this.backlinksRepository.remove(backlink);
  }
}
