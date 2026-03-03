import { Role } from '../../common/enums/role.enum.js';
export declare class User {
    id: number;
    email: string;
    password: string;
    name: string;
    role: Role;
    wallet: number;
    createdAt: Date;
    updatedAt: Date;
}
