import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';
import { Role } from '../../common/enums/role.enum.js';

export class RegisterDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsOptional()
  @IsEnum([Role.ANNONCEUR, Role.ACHETEUR], {
    message: 'Role must be annonceur or acheteur',
  })
  role?: Role.ANNONCEUR | Role.ACHETEUR;
}
