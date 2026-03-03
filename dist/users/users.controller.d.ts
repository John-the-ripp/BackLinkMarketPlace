import { Role } from '../common/enums/role.enum.js';
import { UsersService } from './users.service.js';
import { UpdateUserDto } from './dto/update-user.dto.js';
export declare class UsersController {
    private usersService;
    constructor(usersService: UsersService);
    findAll(): Promise<Omit<import("./entities/user.entity.js").User, "password">[]>;
    getProfile(req: any): Promise<{
        id: number;
        email: string;
        name: string;
        role: Role;
        wallet: number;
        createdAt: Date;
        updatedAt: Date;
    }>;
    updateProfile(updateUserDto: UpdateUserDto, req: any): Promise<{
        id: number;
        email: string;
        name: string;
        role: Role;
        wallet: number;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
