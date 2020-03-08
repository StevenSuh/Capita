import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './User';
import { Account } from './Account';

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn()
  user: User;

  @ManyToOne(() => Account, { onDelete: 'CASCADE' })
  @JoinColumn()
  account: Account;

  @Column({ unique: true, nullable: true })
  plaidTransactionId: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  category: string;

  @Column()
  type: string;

  @Column({ type: 'decimal' })
  amount: number;

  @Column({ nullable: true })
  isoCurrencyCode: string;

  @Column({ nullable: true })
  unofficialCurrencyCode: string;

  @Column()
  date: string;

  @Column({ nullable: true })
  note: string;

  @Column({ default: false })
  pending: boolean;

  @Column({ default: false })
  recurring: boolean;

  @Column({ default: false })
  manuallyCreated: boolean;

  @Column({ default: false })
  hidden: boolean;
}
