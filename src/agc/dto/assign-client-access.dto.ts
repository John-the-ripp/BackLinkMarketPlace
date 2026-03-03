import { IsArray, IsEnum, IsInt } from 'class-validator';
import { ClientPermission } from '../entities/agc-client-access.entity.js';

export class AssignClientAccessDto {
  @IsInt()
  userId: number;

  @IsArray()
  @IsEnum(ClientPermission, { each: true })
  permissions: ClientPermission[];
}
