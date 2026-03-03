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
import { BacklinksService } from './backlinks.service.js';
import { CreateBacklinkDto } from './dto/create-backlink.dto.js';
import { UpdateBacklinkDto } from './dto/update-backlink.dto.js';
import { BuyBacklinkDto } from './dto/buy-backlink.dto.js';

@Controller('backlinks')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class BacklinksController {
  constructor(private backlinksService: BacklinksService) {}

  // ── ANNONCEUR : mettre un backlink en vente ──
  @Post()
  @Roles(Role.ANNONCEUR)
  create(@Body() createBacklinkDto: CreateBacklinkDto, @Request() req) {
    return this.backlinksService.create(createBacklinkDto, req.user.id);
  }

  // ── ADMIN : voir tous les backlinks ──
  @Get('all')
  @Roles(Role.ADMIN)
  findAll() {
    return this.backlinksService.findAll();
  }

  // ── MARKETPLACE : backlinks disponibles ──
  @Get('marketplace')
  @Roles(Role.ANNONCEUR, Role.ACHETEUR, Role.AGC, Role.AGC_SUB)
  findAllAvailable() {
    return this.backlinksService.findAllAvailable();
  }

  // ── ANNONCEUR : mes backlinks en vente ──
  @Get('my-sales')
  @Roles(Role.ANNONCEUR)
  findMySales(@Request() req) {
    return this.backlinksService.findMySales(req.user.id);
  }

  // ── ACHETEUR : mes achats ──
  @Get('my-purchases')
  @Roles(Role.ACHETEUR)
  findMyPurchases(@Request() req) {
    return this.backlinksService.findMyPurchases(req.user.id);
  }

  // ── Détail d'un backlink ──
  @Get(':id')
  @Roles(Role.ANNONCEUR, Role.ACHETEUR, Role.AGC, Role.AGC_SUB)
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.backlinksService.findOne(id);
  }

  // ── Acheter un backlink (ACHETEUR: wallet perso, AGC/AGC_SUB: wallet client) ──
  @Post(':id/buy')
  @Roles(Role.ACHETEUR, Role.AGC, Role.AGC_SUB)
  buy(
    @Param('id', ParseIntPipe) id: number,
    @Body() buyBacklinkDto: BuyBacklinkDto,
    @Request() req,
  ) {
    return this.backlinksService.buy(id, req.user.id, buyBacklinkDto.clientId);
  }

  // ── ANNONCEUR : modifier mon backlink ──
  @Put(':id')
  @Roles(Role.ANNONCEUR)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateBacklinkDto: UpdateBacklinkDto,
    @Request() req,
  ) {
    return this.backlinksService.update(id, updateBacklinkDto, req.user.id);
  }

  // ── ANNONCEUR : supprimer mon backlink ──
  @Delete(':id')
  @Roles(Role.ANNONCEUR)
  remove(@Param('id', ParseIntPipe) id: number, @Request() req) {
    return this.backlinksService.remove(id, req.user.id);
  }
}
