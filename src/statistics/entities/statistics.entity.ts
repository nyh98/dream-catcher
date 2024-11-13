import { User } from 'src/user/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('statistics_data')
export class Statistics {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.statistics)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'deep_sleep_day' })
  deepSleepDay: Date;
}
