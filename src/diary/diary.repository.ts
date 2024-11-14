import { User } from './../user/entities/user.entity';
import { Injectable } from '@nestjs/common';
import { Brackets, DataSource, In, Repository } from 'typeorm';
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
      const tagNameArray = createDiaryDto.tags.map((tag) => tag.name);
      tags = await this.getTagsByNames(tagNameArray);
    }

    const newDiary = this.create({
      user,
      ...createDiaryDto,
      contents: this.serializeContent(createDiaryDto.contents),
      tags,
    });

    const successDiary = await this.save(newDiary);
    successDiary.contents = this.deserializeContent(successDiary.contents);

    return successDiary;
  }

  async updateDiary(diary: Diary, updateDiaryDto: UpdateDiaryDto) {
    let contents: string;
    let tags: Tag[] = [];

    if (updateDiaryDto.tags) {
      const tagNameArray = updateDiaryDto.tags.map((tag) => tag.name);
      tags = await this.getTagsByNames(tagNameArray);
    } else {
      tags = diary.tags;
    }

    if (updateDiaryDto.contents) {
      contents = this.serializeContent(updateDiaryDto.contents);
    } else {
      contents = this.serializeContent(diary.contents);
    }

    const updateDiary = this.create({
      ...diary,
      ...updateDiaryDto,
      contents,
      interpretation: null, //수정 시 기존 해몽 초기화
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

  async getAllDiaries(user: User, limit: number, page: number, text?: string) {
    const query = this.createQueryBuilder('diary')
      .leftJoinAndSelect('diary.tags', 'tags')
      .where('diary.user_id = :userId', { userId: user.id })
      .skip((page - 1) * limit)
      .take(limit);

    if (text) {
      query.andWhere(
        new Brackets((qb) => {
          qb.where('diary.contents like :text', { text: `%${text}%` });
          qb.orWhere('diary.title like :title', { title: `%${text}%` });
        }),
      );
    }

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
