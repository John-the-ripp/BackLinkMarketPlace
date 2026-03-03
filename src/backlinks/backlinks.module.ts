import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Backlink } from './entities/backlink.entity.js';
import { BacklinksService } from './backlinks.service.js';
import { BacklinksController } from './backlinks.controller.js';
import { AgcModule } from '../agc/agc.module.js';

@Module({
  imports: [TypeOrmModule.forFeature([Backlink]), AgcModule],
  controllers: [BacklinksController],
  providers: [BacklinksService],
  exports: [BacklinksService],
})
export class BacklinksModule {}
