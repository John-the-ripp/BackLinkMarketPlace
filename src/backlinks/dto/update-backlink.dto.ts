import { IsEnum, IsOptional, IsString, IsUrl } from 'class-validator';
import { BacklinkStatus } from '../entities/backlink.entity.js';
import { CreateBacklinkDto } from './create-backlink.dto.js';
import { PartialType } from '@nestjs/mapped-types';


export class UpdateBacklinkDto extends PartialType(CreateBacklinkDto) {
}
