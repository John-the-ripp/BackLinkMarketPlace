import {
  Controller,
  Get,
  Put,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../common/guards/roles.guard.js';
import { Roles } from '../common/decorators/roles.decorator.js';
import { Role } from '../common/enums/role.enum.js';
import { UsersService } from './users.service.js';
import { UpdateUserDto } from './dto/update-user.dto.js';

@Controller('users')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  @Roles(Role.ADMIN)
  findAll() {
    return this.usersService.findAll();
  }

  @Get('profile')
  @Roles(Role.ANNONCEUR, Role.ACHETEUR, Role.AGC, Role.AGC_SUB)
  getProfile(@Request() req) {
    return this.usersService.getProfile(req.user.id);
  }

  @Put('profile')
  @Roles(Role.ANNONCEUR, Role.ACHETEUR, Role.AGC, Role.AGC_SUB)
  updateProfile(@Body() updateUserDto: UpdateUserDto, @Request() req) {
    return this.usersService.updateProfile(req.user.id, updateUserDto);
  }
}
