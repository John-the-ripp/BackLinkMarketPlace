import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../common/guards/roles.guard.js';
import { Roles } from '../common/decorators/roles.decorator.js';
import { Role } from '../common/enums/role.enum.js';
import { AgcService } from './agc.service.js';
import { CreateClientDto } from './dto/create-client.dto.js';
import { UpdateClientDto } from './dto/update-client.dto.js';
import { FundClientWalletDto } from './dto/fund-client-wallet.dto.js';
import { CreateSubUserDto } from './dto/create-sub-user.dto.js';
import { AssignClientAccessDto } from './dto/assign-client-access.dto.js';
import { UpdateClientAccessDto } from './dto/update-client-access.dto.js';

@Controller('agc')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class AgcController {
  constructor(private agcService: AgcService) {}

  // ═══════════════════════════════════════
  // ── GESTION DES CLIENTS ──
  // ═══════════════════════════════════════

  @Post('clients')
  @Roles(Role.AGC)
  createClient(@Body() dto: CreateClientDto, @Request() req) {
    return this.agcService.createClient(req.user.id, dto);
  }

  @Get('clients')
  @Roles(Role.AGC, Role.AGC_SUB)
  findAllClients(@Request() req) {
    return this.agcService.findAllClients(req.user.id, req.user.role);
  }

  @Get('clients/:clientId')
  @Roles(Role.AGC, Role.AGC_SUB)
  findClientById(@Param('clientId', ParseIntPipe) clientId: number, @Request() req) {
    return this.agcService.findClientById(clientId, req.user.id, req.user.role);
  }

  @Put('clients/:clientId')
  @Roles(Role.AGC)
  updateClient(
    @Param('clientId', ParseIntPipe) clientId: number,
    @Body() dto: UpdateClientDto,
    @Request() req,
  ) {
    return this.agcService.updateClient(clientId, req.user.id, dto);
  }

  @Delete('clients/:clientId')
  @Roles(Role.AGC)
  deactivateClient(@Param('clientId', ParseIntPipe) clientId: number, @Request() req) {
    return this.agcService.deactivateClient(clientId, req.user.id);
  }

  @Post('clients/:clientId/fund')
  @Roles(Role.AGC)
  fundClientWallet(
    @Param('clientId', ParseIntPipe) clientId: number,
    @Body() dto: FundClientWalletDto,
    @Request() req,
  ) {
    return this.agcService.fundClientWallet(clientId, req.user.id, dto);
  }

  // ═══════════════════════════════════════
  // ── GESTION DES SOUS-UTILISATEURS ──
  // ═══════════════════════════════════════

  @Post('sub-users')
  @Roles(Role.AGC)
  createSubUser(@Body() dto: CreateSubUserDto, @Request() req) {
    return this.agcService.createSubUser(req.user.id, dto);
  }

  @Get('sub-users')
  @Roles(Role.AGC)
  findAllSubUsers(@Request() req) {
    return this.agcService.findAllSubUsers(req.user.id);
  }

  @Delete('sub-users/:userId')
  @Roles(Role.AGC)
  removeSubUser(@Param('userId', ParseIntPipe) userId: number, @Request() req) {
    return this.agcService.removeSubUser(userId, req.user.id);
  }

  // ═══════════════════════════════════════
  // ── GESTION DES PERMISSIONS ──
  // ═══════════════════════════════════════

  @Post('clients/:clientId/access')
  @Roles(Role.AGC)
  assignAccess(
    @Param('clientId', ParseIntPipe) clientId: number,
    @Body() dto: AssignClientAccessDto,
    @Request() req,
  ) {
    return this.agcService.assignAccess(clientId, req.user.id, dto);
  }

  @Get('clients/:clientId/access')
  @Roles(Role.AGC)
  getClientAccess(@Param('clientId', ParseIntPipe) clientId: number, @Request() req) {
    return this.agcService.getClientAccess(clientId, req.user.id);
  }

  @Put('clients/:clientId/access/:userId')
  @Roles(Role.AGC)
  updateAccess(
    @Param('clientId', ParseIntPipe) clientId: number,
    @Param('userId', ParseIntPipe) userId: number,
    @Body() dto: UpdateClientAccessDto,
    @Request() req,
  ) {
    return this.agcService.updateAccess(clientId, userId, req.user.id, dto);
  }

  @Delete('clients/:clientId/access/:userId')
  @Roles(Role.AGC)
  revokeAccess(
    @Param('clientId', ParseIntPipe) clientId: number,
    @Param('userId', ParseIntPipe) userId: number,
    @Request() req,
  ) {
    return this.agcService.revokeAccess(clientId, userId, req.user.id);
  }

  // ═══════════════════════════════════════
  // ── DASHBOARD ──
  // ═══════════════════════════════════════

  @Get('dashboard')
  @Roles(Role.AGC)
  getDashboard(@Request() req) {
    return this.agcService.getDashboard(req.user.id);
  }

  @Get('clients/:clientId/purchases')
  @Roles(Role.AGC, Role.AGC_SUB)
  getClientPurchases(@Param('clientId', ParseIntPipe) clientId: number, @Request() req) {
    return this.agcService.getClientPurchases(clientId, req.user.id, req.user.role);
  }
}
