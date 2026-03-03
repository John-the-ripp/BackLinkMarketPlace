import { IsInt, IsOptional } from 'class-validator';

export class BuyBacklinkDto {
  @IsOptional()
  @IsInt()
  clientId?: number;
}
