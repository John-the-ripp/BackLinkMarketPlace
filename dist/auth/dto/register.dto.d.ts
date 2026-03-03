import { Role } from '../../common/enums/role.enum.js';
export declare class RegisterDto {
    name: string;
    email: string;
    password: string;
    role?: Role.ANNONCEUR | Role.ACHETEUR;
}
