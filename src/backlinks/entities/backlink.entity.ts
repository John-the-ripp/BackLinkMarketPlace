import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity.js';

export enum BacklinkStatus {
  AVAILABLE = 'available',
  SOLD = 'sold',
}

@Entity('backlinks')
export class Backlink {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  url: string;

  @Column()
  anchorText: string;

  @Column()
  targetUrl: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({ type: 'enum', enum: BacklinkStatus, default: BacklinkStatus.AVAILABLE })
  status: BacklinkStatus;

  // Le vendeur qui met en vente le backlink
  @ManyToOne(() => User)
  seller: User;

  @Column()
  sellerId: number;

  // L'acheteur (null tant que pas acheté)
  @ManyToOne(() => User, { nullable: true })
  buyer: User;

  @Column({ nullable: true })
  buyerId: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
