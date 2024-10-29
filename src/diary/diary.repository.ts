import { User } from './../user/entities/user.entity';
import { Injectable } from '@nestjs/common';
import { DataSource, In, Repository } from 'typeorm';
import { Diary } from './entities/diary.entity';
import { ContentDto, CreateDiaryDto } from './dto/create-diary.dto';
import { UpdateDiaryDto } from './dto/update-diary.dto';
import { Tag } from './entities/tag.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class DiaryRepository extends Repository<Diary> {
  constructor(
    dataSource: DataSource,
    @InjectRepository(Tag) private readonly tagRepository: Repository<Tag>,
  ) {
    super(Diary, dataSource.createEntityManager());
  }

  private serializeContent(contnet: ContentDto | string) {
    return JSON.stringify(contnet);
  }

  private deserializeContent(content: string) {
    return JSON.parse(content);
  }

  private getTagsByNames(tags: string[]) {
    return this.tagRepository.find({ where: { name: In(tags) } });
  }

  private getTodayYearMonthDay() {
    const now = new Date();
    const utc = now.getTime() + now.getTimezoneOffset() * 60 * 1000;
    const koreaTimeDiff = 9 * 60 * 60 * 1000;
    const korNow = new Date(utc + koreaTimeDiff);

    return `${korNow.getFullYear()}-${korNow.getMonth() + 1}-${korNow.getDate()}`;
  }

  async insertDiary(user: User, createDiaryDto: CreateDiaryDto) {
    let tags: Tag[] = [];

    if (createDiaryDto.tags) {
      tags = await this.getTagsByNames(createDiaryDto.tags);
    }

    const newDiary = this.create({
      user,
      ...createDiaryDto,
      contents: this.serializeContent(createDiaryDto.content),
      tags,
    });

    await this.save(newDiary);
  }

  async updateDiary(diary: Diary, updateDiaryDto: UpdateDiaryDto) {
    let contents: string;
    let tags: Tag[] = [];

    if (updateDiaryDto.tags) {
      tags = await this.getTagsByNames(updateDiaryDto.tags);
    } else {
      tags = diary.tags;
    }

    if (updateDiaryDto.content) {
      contents = this.serializeContent(updateDiaryDto.content);
    } else {
      contents = this.serializeContent(diary.contents);
    }

    const updateDiary = this.create({
      ...diary,
      ...updateDiaryDto,
      contents,
      tags,
    });

    const savedDiary = await this.save(updateDiary);
    savedDiary.contents = this.deserializeContent(savedDiary.contents);

    return savedDiary;
  }

  findTodayDiary(user: User) {
    const query = this.createQueryBuilder('diary')
      .where('diary.user_id = :userId', { userId: user.id })
      .andWhere('DATE(diary.created_at) = :today', {
        today: this.getTodayYearMonthDay(),
      });

    return query.getOne();
  }

  async getDiary(user: User, diaryId: number) {
    const diary = await this.findOne({
      where: { id: diaryId, user },
      relations: ['tags'],
    });

    if (diary) {
      diary.contents = this.deserializeContent(diary.contents);
    }

    return diary;
  }

  async getDiariesByCalendar(user: User, year?: number, month?: number) {
    const query = this.createQueryBuilder('diary')
      .leftJoinAndSelect('diary.tags', 'tags')
      .where('diary.user_id = :userId', { userId: user.id });

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

    for (let i = 0; i < diaries.length; i++) {
      const serializeContent = diaries[i].contents;
      diaries[i].contents = this.deserializeContent(serializeContent);
    }

    return diaries;
  }

  async getAllDiaries(user: User, limit: number, page: number) {
    const query = this.createQueryBuilder('diary')
      .leftJoinAndSelect('diary.tags', 'tags')
      .where('diary.user_id = :userId', { userId: user.id })
      .skip((page - 1) * limit)
      .take(limit);

    const diaries = await query.getMany();
    const totalCount = await query.getCount();

    for (let i = 0; i < diaries.length; i++) {
      const serializeContent = diaries[i].contents;
      diaries[i].contents = this.deserializeContent(serializeContent);
    }

    return { diaries, totalCount };
  }

  getAlltags() {
    return this.tagRepository.find();
  }
}
