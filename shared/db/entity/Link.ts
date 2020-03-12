import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './User';

@Entity()
export class Link {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn()
  user: User;

  // Foreign key
  @Column()
  userId: number;

  @Column()
  accessToken: string;

  @Column({ unique: true })
  plaidItemId: string;

  @Column()
  plaidInstitutionId: string;

  @Column()
  institutionName: string;

  @Column({ nullable: true })
  institutionUrl: string;

  @Column({ type: 'text', nullable: true })
  institutionLogo: string;

  @Column({ default: false })
  ready: boolean;

  @Column({ default: false })
  needsUpdate: boolean;
}
