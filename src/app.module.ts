import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module.js';
import { UsersModule } from './users/users.module.js';
import { BacklinksModule } from './backlinks/backlinks.module.js';
import { User } from './users/entities/user.entity.js';
import { Backlink } from './backlinks/entities/backlink.entity.js';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL || 'postgresql://neondb_owner:npg_KpbkU4Dnyfr0@ep-royal-truth-al41kx4x-pooler.c-3.eu-central-1.aws.neon.tech/neondb?sslmode=require',
      ssl: true,
      entities: [User, Backlink],
      synchronize: true, // Disable in production
    }),
    AuthModule,
    UsersModule,
    BacklinksModule,
  ],
})
export class AppModule {}
