import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Diary } from './diary.entity';

@Entity()
export class Tag {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  tag: string;

  @ManyToMany(() => Diary, (diary) => diary.tags)
  diaries: Diary[];
}
