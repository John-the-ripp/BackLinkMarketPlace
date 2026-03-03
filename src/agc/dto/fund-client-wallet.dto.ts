import { IsNumber, Min } from 'class-validator';

export class FundClientWalletDto {
  @IsNumber()
  @Min(0.01)
  amount: number;
}
