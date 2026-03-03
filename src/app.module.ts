import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module.js';
import { UsersModule } from './users/users.module.js';
import { BacklinksModule } from './backlinks/backlinks.module.js';
import { User } from './users/entities/user.entity.js';
import { Backlink } from './backlinks/entities/backlink.entity.js';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres' as const,
        url: config.get<string>('DATABASE_URL'),
        ssl: true,
        entities: [User, Backlink],
        synchronize: true, // Disable in production
      }),
    }),
    AuthModule,
    UsersModule,
    BacklinksModule,
  ],
})
export class AppModule {}
