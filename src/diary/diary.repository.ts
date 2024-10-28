import { User } from './../user/entities/user.entity';
import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Diary } from './entities/diary.entity';
import { Content, CreateDiaryDto } from './dto/create-diary.dto';
import { UpdateDiaryDto } from './dto/update-diary.dto';
import { Tag } from './entities/tag.entity';

@Injectable()
export class DiaryRepository extends Repository<Diary> {
  constructor(dataSource: DataSource) {
    super(Diary, dataSource.createEntityManager());
  }

  private serializeContent(contnet: Content[] | string) {
    return JSON.stringify(contnet);
  }

  private deserializeContent(content: string) {
    return JSON.parse(content);
  }

  private getTodayYearMonthDay() {
    const now = new Date();
    const utc = now.getTime() + now.getTimezoneOffset() * 60 * 1000;
    const koreaTimeDiff = 9 * 60 * 60 * 1000;
    const korNow = new Date(utc + koreaTimeDiff);

    return `${korNow.getFullYear()}-${korNow.getMonth() + 1}-${korNow.getDate()}`;
  }

  async insertDiary(user: User, createDiaryDto: CreateDiaryDto) {
    const newDiary = this.create({
      user,
      ...createDiaryDto,
      contents: this.serializeContent(createDiaryDto.content),
    });

    await this.save(newDiary);
  }

  async updateDiary(diary: Diary, updateDiaryDto: UpdateDiaryDto) {
    let contents: string;

    if (updateDiaryDto.content) {
      contents = this.serializeContent(updateDiaryDto.content);
    } else {
      contents = this.serializeContent(diary.contents);
    }

    const updateDiary = this.create({
      ...diary,
      ...updateDiaryDto,
      contents,
    });

    const savedDiary = await this.save(updateDiary);
    savedDiary.contents = this.deserializeContent(savedDiary.contents);

    return savedDiary;
  }

  findTodayDiary(user: User) {
    return this.createQueryBuilder('diary')
      .where('diary.user_id = :userId', { userId: user.id })
      .andWhere('DATE(diary.created_at) = :today', {
        today: this.getTodayYearMonthDay(),
      })
      .getOne();
  }

  async getDiary(user: User, diaryId: number) {
    const diary = await this.findOne({ where: { id: diaryId, user } });

    if (diary) {
      diary.contents = this.deserializeContent(diary.contents);
    }

    return diary;
  }

  async getDiaries(user: User, year?: number, month?: number) {
    const query = this.createQueryBuilder('diary').where(
      'diary.user_id = :userId',
      { userId: user.id },
    );

    if (year) {
      query.andWhere('YEAR(diary.created_at) = :year', { year });
    } else {
      query.andWhere('MONTH(diary.created_at) = MONTH(CURRENT_DATE())');
    }

    if (month) {
      query.andWhere('MONTH(diary.created_at) = :month', { month });
    } else {
      query.andWhere('MONTH(diary.created_at) = MONTH(CURRENT_DATE())');
    }

    const diaries = await query.getMany();

    const formatedDiary = diaries.map((diary) => {
      return {
        ...diary,
        contents: this.deserializeContent(diary.contents),
      };
    });

    return formatedDiary;
  }
}
