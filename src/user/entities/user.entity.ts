import { Diary } from 'src/diary/entities/diary.entity';
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
  uid: number;

  @Column()
  templateType: string;

  @OneToMany(() => Diary, (diary) => diary)
  diarys: Diary[];
}
