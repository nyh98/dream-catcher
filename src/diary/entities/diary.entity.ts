import { User } from 'src/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Tag } from './tag.entity';

@Entity()
export class Diary {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ type: 'text' })
  contents: string;

  @Column({ nullable: true })
  image: string;

  @Column({ nullable: true, type: 'text' })
  interpretation: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @Column({ name: 'template_type' })
  templateType: string;

  @Column({ name: 'emotion_score' })
  emotionScore: number;

  @ManyToOne(() => User, (user) => user.diarys)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToMany(() => Tag, (tag) => tag.diaries, { cascade: true })
  @JoinTable({
    name: 'diaries_tags',
    joinColumn: { name: 'diary_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'tag_id', referencedColumnName: 'id' },
  })
  tags: Tag[];
}
