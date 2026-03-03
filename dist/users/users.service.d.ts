import { Repository } from 'typeorm';
import { User } from './entities/user.entity.js';
import { CreateUserDto } from './dto/create-user.dto.js';
import { UpdateUserDto } from './dto/update-user.dto.js';
export declare class UsersService {
    private usersRepository;
    constructor(usersRepository: Repository<User>);
    create(createUserDto: CreateUserDto): Promise<User>;
    findAll(): Promise<Omit<User, 'password'>[]>;
    findByEmail(email: string): Promise<User | null>;
    findById(id: number): Promise<User | null>;
    getProfile(id: number): Promise<{
        id: number;
        email: string;
        name: string;
        role: import("../common/enums/role.enum.js").Role;
        wallet: number;
        createdAt: Date;
        updatedAt: Date;
    }>;
    updateProfile(id: number, updateUserDto: UpdateUserDto): Promise<{
        id: number;
        email: string;
        name: string;
        role: import("../common/enums/role.enum.js").Role;
        wallet: number;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
