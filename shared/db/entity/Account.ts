import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './User';
import { Link } from './Link';

@Entity()
export class Account {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn()
  user: User;

  // Foreign key
  @Column()
  userId: number;

  @ManyToOne(() => Link, { onDelete: 'CASCADE' })
  @JoinColumn()
  link: Link;

  // Foreign key
  @Column()
  linkId: number;

  @Column({ unique: true, nullable: true })
  plaidAccountId: string;

  @Column({ nullable: true })
  mask: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  officialName: string;

  @Column()
  subtype: string;

  @Column()
  type: string;

  @Column()
  verificationStatus: string;

  @Column({ type: 'decimal', nullable: true })
  balanceAvailable: number;

  @Column({ type: 'decimal' })
  balanceCurrent: number;

  @Column({ type: 'decimal', nullable: true })
  balanceLimit: number;

  @Column({ nullable: true })
  balanceIsoCurrencyCode: string;

  @Column({ nullable: true })
  balanceUnofficialCurrencyCode: string;

  @Column()
  manuallyCreated: boolean;

  @Column({ default: false })
  hidden: boolean;

  @Column({ default: false })
  needsUpdate: boolean;
}
