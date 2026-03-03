import { IsArray, IsEnum } from 'class-validator';
import { ClientPermission } from '../entities/agc-client-access.entity.js';

export class UpdateClientAccessDto {
  @IsArray()
  @IsEnum(ClientPermission, { each: true })
  permissions: ClientPermission[];
}
