import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AgcClient } from './entities/agc-client.entity.js';
import { AgcClientAccess } from './entities/agc-client-access.entity.js';
import { User } from '../users/entities/user.entity.js';
import { Backlink } from '../backlinks/entities/backlink.entity.js';
import { AgcService } from './agc.service.js';
import { AgcController } from './agc.controller.js';

@Module({
  imports: [TypeOrmModule.forFeature([AgcClient, AgcClientAccess, User, Backlink])],
  controllers: [AgcController],
  providers: [AgcService],
  exports: [AgcService],
})
export class AgcModule {}
