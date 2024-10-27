import { User } from './../user/entities/user.entity';
import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Diary } from './entities/diary.entity';
import { Content, CreateDiaryDto } from './dto/create-diary.dto';

@Injectable()
export class DiaryRepository extends Repository<Diary> {
  constructor(dataSource: DataSource) {
    super(Diary, dataSource.createEntityManager());
  }

  private serializeContent(contnet: Content[]) {
    return JSON.stringify(contnet);
  }

  insertDiary(user: User, createDiaryDto: CreateDiaryDto) {
    const newDiary = this.create({
      user,
      ...createDiaryDto,
      contents: this.serializeContent(createDiaryDto.content),
    });
    this.save(newDiary);
  }
}
