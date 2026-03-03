import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  Unique,
} from 'typeorm';
import { User } from '../../users/entities/user.entity.js';
import { AgcClient } from './agc-client.entity.js';

export enum ClientPermission {
  VIEW = 'view',
  BUY = 'buy',
  MANAGE = 'manage',
}

@Entity('agc_client_access')
@Unique(['userId', 'clientId'])
export class AgcClientAccess {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User)
  user: User;

  @Column()
  userId: number;

  @ManyToOne(() => AgcClient, { onDelete: 'CASCADE' })
  client: AgcClient;

  @Column()
  clientId: number;

  @Column('simple-array')
  permissions: ClientPermission[];

  @CreateDateColumn()
  createdAt: Date;
}
