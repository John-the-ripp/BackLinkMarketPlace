import { IsNotEmpty, IsNumber, IsString, IsUrl } from 'class-validator';

export class CreateBacklinkDto {
  @IsUrl()
  url: string;

  @IsString()
  @IsNotEmpty()
  anchorText: string;

  @IsUrl()
  targetUrl: string;

  @IsNumber()
  price: number;
}
