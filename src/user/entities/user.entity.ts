import { Diary } from 'src/diary/entities/diary.entity';
import { Statistics } from 'src/statistics/entities/statistics.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  email: string;

  @Column({ name: 'profile_img' })
  profileImg: string;

  @Column()
  provider: 'kakao' | 'google';

  @Column()
  uid: string;

  @Column()
  templateType: string;

  @OneToMany(() => Diary, (diary) => diary.user)
  diarys: Diary[];

  @OneToMany(() => Statistics, (sta) => sta.user)
  statistics: Statistics[];
}
