import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module.js';
import { UsersModule } from './users/users.module.js';
import { BacklinksModule } from './backlinks/backlinks.module.js';
import { AgcModule } from './agc/agc.module.js';
import { User } from './users/entities/user.entity.js';
import { Backlink } from './backlinks/entities/backlink.entity.js';
import { AgcClient } from './agc/entities/agc-client.entity.js';
import { AgcClientAccess } from './agc/entities/agc-client-access.entity.js';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres' as const,
        url: config.get<string>('DATABASE_URL'),
        ssl: true,
        entities: [User, Backlink, AgcClient, AgcClientAccess],
        synchronize: true, // Disable in production
      }),
    }),
    AuthModule,
    UsersModule,
    BacklinksModule,
    AgcModule,
  ],
})
export class AppModule {}
