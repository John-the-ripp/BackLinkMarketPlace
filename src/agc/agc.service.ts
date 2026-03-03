import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { AgcClient } from './entities/agc-client.entity.js';
import { AgcClientAccess, ClientPermission } from './entities/agc-client-access.entity.js';
import { User } from '../users/entities/user.entity.js';
import { Backlink } from '../backlinks/entities/backlink.entity.js';
import { Role } from '../common/enums/role.enum.js';
import { CreateClientDto } from './dto/create-client.dto.js';
import { UpdateClientDto } from './dto/update-client.dto.js';
import { FundClientWalletDto } from './dto/fund-client-wallet.dto.js';
import { CreateSubUserDto } from './dto/create-sub-user.dto.js';
import { AssignClientAccessDto } from './dto/assign-client-access.dto.js';
import { UpdateClientAccessDto } from './dto/update-client-access.dto.js';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AgcService {
  constructor(
    @InjectRepository(AgcClient)
    private clientRepo: Repository<AgcClient>,
    @InjectRepository(AgcClientAccess)
    private accessRepo: Repository<AgcClientAccess>,
    @InjectRepository(User)
    private usersRepo: Repository<User>,
    @InjectRepository(Backlink)
    private backlinksRepo: Repository<Backlink>,
    private dataSource: DataSource,
  ) {}

  // ═══════════════════════════════════════
  // ── GESTION DES CLIENTS ──
  // ═══════════════════════════════════════

  async createClient(agcId: number, dto: CreateClientDto): Promise<AgcClient> {
    const client = this.clientRepo.create({
      name: dto.name,
      contactEmail: dto.contactEmail,
      wallet: dto.initialWallet ?? 0,
      agcId,
    });
    return this.clientRepo.save(client);
  }

  async findAllClients(userId: number, userRole: Role): Promise<AgcClient[]> {
    if (userRole === Role.AGC) {
      return this.clientRepo.find({
        where: { agcId: userId, isActive: true },
        order: { createdAt: 'DESC' },
      });
    }

    // AGC_SUB : seulement les clients auxquels il a accès
    const accesses = await this.accessRepo.find({
      where: { userId },
      relations: ['client'],
    });
    return accesses
      .map((a) => a.client)
      .filter((c) => c.isActive);
  }

  async findClientById(clientId: number, userId: number, userRole: Role): Promise<AgcClient> {
    const client = await this.clientRepo.findOne({ where: { id: clientId } });
    if (!client || !client.isActive) {
      throw new NotFoundException(`Client #${clientId} not found`);
    }

    if (userRole === Role.AGC) {
      if (client.agcId !== userId) {
        throw new ForbiddenException('This client does not belong to your agency');
      }
      return client;
    }

    // AGC_SUB : vérifier l'accès
    const user = await this.usersRepo.findOne({ where: { id: userId } });
    if (!user || user.agcId !== client.agcId) {
      throw new ForbiddenException('This client does not belong to your agency');
    }
    const access = await this.accessRepo.findOne({
      where: { userId, clientId },
    });
    if (!access) {
      throw new ForbiddenException('You do not have access to this client');
    }

    return client;
  }

  async updateClient(clientId: number, agcId: number, dto: UpdateClientDto): Promise<AgcClient> {
    const client = await this.clientRepo.findOne({ where: { id: clientId } });
    if (!client || !client.isActive) {
      throw new NotFoundException(`Client #${clientId} not found`);
    }
    if (client.agcId !== agcId) {
      throw new ForbiddenException('This client does not belong to your agency');
    }

    Object.assign(client, dto);
    return this.clientRepo.save(client);
  }

  async deactivateClient(clientId: number, agcId: number): Promise<void> {
    const client = await this.clientRepo.findOne({ where: { id: clientId } });
    if (!client) {
      throw new NotFoundException(`Client #${clientId} not found`);
    }
    if (client.agcId !== agcId) {
      throw new ForbiddenException('This client does not belong to your agency');
    }

    client.isActive = false;
    await this.clientRepo.save(client);
  }

  async fundClientWallet(clientId: number, agcId: number, dto: FundClientWalletDto): Promise<AgcClient> {
    const client = await this.clientRepo.findOne({ where: { id: clientId } });
    if (!client || !client.isActive) {
      throw new NotFoundException(`Client #${clientId} not found`);
    }
    if (client.agcId !== agcId) {
      throw new ForbiddenException('This client does not belong to your agency');
    }

    client.wallet = Number(client.wallet) + dto.amount;
    return this.clientRepo.save(client);
  }

  // ═══════════════════════════════════════
  // ── GESTION DES SOUS-UTILISATEURS ──
  // ═══════════════════════════════════════

  async createSubUser(agcId: number, dto: CreateSubUserDto): Promise<Omit<User, 'password'>> {
    const existing = await this.usersRepo.findOne({ where: { email: dto.email } });
    if (existing) {
      throw new BadRequestException('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const subUser = this.usersRepo.create({
      name: dto.name,
      email: dto.email,
      password: hashedPassword,
      role: Role.AGC_SUB,
      agcId,
    });

    const saved = await this.usersRepo.save(subUser);
    const { password, ...result } = saved;
    return result;
  }

  async findAllSubUsers(agcId: number): Promise<Omit<User, 'password'>[]> {
    const subUsers = await this.usersRepo.find({
      where: { agcId, role: Role.AGC_SUB },
      order: { createdAt: 'DESC' },
    });
    return subUsers.map(({ password, ...rest }) => rest);
  }

  async removeSubUser(userId: number, agcId: number): Promise<void> {
    const user = await this.usersRepo.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException(`User #${userId} not found`);
    }
    if (user.agcId !== agcId || user.role !== Role.AGC_SUB) {
      throw new ForbiddenException('This user is not your sub-user');
    }

    // Supprimer ses accès clients d'abord
    await this.accessRepo.delete({ userId });
    await this.usersRepo.remove(user);
  }

  // ═══════════════════════════════════════
  // ── GESTION DES PERMISSIONS ──
  // ═══════════════════════════════════════

  async assignAccess(clientId: number, agcId: number, dto: AssignClientAccessDto): Promise<AgcClientAccess> {
    // Vérifier que le client appartient à l'AGC
    const client = await this.clientRepo.findOne({ where: { id: clientId } });
    if (!client || !client.isActive) {
      throw new NotFoundException(`Client #${clientId} not found`);
    }
    if (client.agcId !== agcId) {
      throw new ForbiddenException('This client does not belong to your agency');
    }

    // Vérifier que le user est un sous-utilisateur de cet AGC
    const subUser = await this.usersRepo.findOne({ where: { id: dto.userId } });
    if (!subUser || subUser.agcId !== agcId || subUser.role !== Role.AGC_SUB) {
      throw new BadRequestException('User is not a sub-user of your agency');
    }

    // Vérifier s'il y a déjà un accès
    const existing = await this.accessRepo.findOne({
      where: { userId: dto.userId, clientId },
    });
    if (existing) {
      throw new BadRequestException('Access already exists. Use PUT to update permissions.');
    }

    const access = this.accessRepo.create({
      userId: dto.userId,
      clientId,
      permissions: dto.permissions,
    });
    return this.accessRepo.save(access);
  }

  async getClientAccess(clientId: number, agcId: number): Promise<AgcClientAccess[]> {
    const client = await this.clientRepo.findOne({ where: { id: clientId } });
    if (!client) {
      throw new NotFoundException(`Client #${clientId} not found`);
    }
    if (client.agcId !== agcId) {
      throw new ForbiddenException('This client does not belong to your agency');
    }

    return this.accessRepo.find({
      where: { clientId },
      relations: ['user'],
    });
  }

  async updateAccess(
    clientId: number,
    userId: number,
    agcId: number,
    dto: UpdateClientAccessDto,
  ): Promise<AgcClientAccess> {
    const client = await this.clientRepo.findOne({ where: { id: clientId } });
    if (!client) {
      throw new NotFoundException(`Client #${clientId} not found`);
    }
    if (client.agcId !== agcId) {
      throw new ForbiddenException('This client does not belong to your agency');
    }

    const access = await this.accessRepo.findOne({
      where: { userId, clientId },
    });
    if (!access) {
      throw new NotFoundException('Access not found');
    }

    access.permissions = dto.permissions;
    return this.accessRepo.save(access);
  }

  async revokeAccess(clientId: number, userId: number, agcId: number): Promise<void> {
    const client = await this.clientRepo.findOne({ where: { id: clientId } });
    if (!client) {
      throw new NotFoundException(`Client #${clientId} not found`);
    }
    if (client.agcId !== agcId) {
      throw new ForbiddenException('This client does not belong to your agency');
    }

    const access = await this.accessRepo.findOne({
      where: { userId, clientId },
    });
    if (!access) {
      throw new NotFoundException('Access not found');
    }

    await this.accessRepo.remove(access);
  }

  // ═══════════════════════════════════════
  // ── VALIDATION ACHAT POUR CLIENT ──
  // ═══════════════════════════════════════

  async validateClientPurchase(userId: number, userRole: Role, clientId: number): Promise<AgcClient> {
    const client = await this.clientRepo.findOne({ where: { id: clientId } });
    if (!client) {
      throw new NotFoundException(`Client #${clientId} not found`);
    }
    if (!client.isActive) {
      throw new BadRequestException('Client is deactivated');
    }

    if (userRole === Role.AGC) {
      if (client.agcId !== userId) {
        throw new ForbiddenException('This client does not belong to your agency');
      }
      return client;
    }

    if (userRole === Role.AGC_SUB) {
      const user = await this.usersRepo.findOne({ where: { id: userId } });
      if (!user || user.agcId !== client.agcId) {
        throw new ForbiddenException('This client does not belong to your agency');
      }

      const access = await this.accessRepo.findOne({
        where: { userId, clientId },
      });
      if (!access || !access.permissions.includes(ClientPermission.BUY)) {
        throw new ForbiddenException('You do not have buy permission for this client');
      }
      return client;
    }

    throw new ForbiddenException('Only AGC users can purchase for clients');
  }

  // ═══════════════════════════════════════
  // ── DASHBOARD ──
  // ═══════════════════════════════════════

  async getDashboard(agcId: number) {
    const clients = await this.clientRepo.find({
      where: { agcId, isActive: true },
    });

    const clientIds = clients.map((c) => c.id);

    // Compter les achats et montants par client
    const clientsWithStats = await Promise.all(
      clients.map(async (client) => {
        const purchases = await this.backlinksRepo.count({
          where: { clientId: client.id },
        });
        const totalSpent = await this.backlinksRepo
          .createQueryBuilder('backlink')
          .select('COALESCE(SUM(backlink.price), 0)', 'total')
          .where('backlink.clientId = :clientId', { clientId: client.id })
          .getRawOne();

        return {
          id: client.id,
          name: client.name,
          contactEmail: client.contactEmail,
          wallet: client.wallet,
          purchasesCount: purchases,
          totalSpent: Number(totalSpent.total),
        };
      }),
    );

    const subUsersCount = await this.usersRepo.count({
      where: { agcId, role: Role.AGC_SUB },
    });

    return {
      totalClients: clients.length,
      totalSubUsers: subUsersCount,
      totalWalletBalance: clients.reduce((sum, c) => sum + Number(c.wallet), 0),
      totalPurchases: clientsWithStats.reduce((sum, c) => sum + c.purchasesCount, 0),
      totalSpent: clientsWithStats.reduce((sum, c) => sum + c.totalSpent, 0),
      clients: clientsWithStats,
    };
  }

  async getClientPurchases(clientId: number, userId: number, userRole: Role): Promise<Backlink[]> {
    // Vérifier l'accès
    await this.findClientById(clientId, userId, userRole);

    return this.backlinksRepo.find({
      where: { clientId },
      relations: ['seller'],
      order: { createdAt: 'DESC' },
    });
  }
}
