import { ConflictException, Injectable } from '@nestjs/common';
import { CreateDiaryDto } from './dto/create-diary.dto';
import { DiaryRepository } from './diary.repository';
import { User } from 'src/user/entities/user.entity';
import { SearchDiaryDto } from './dto/search-diary.dto';

@Injectable()
export class DiaryService {
  constructor(private readonly diaryRepository: DiaryRepository) {}

  async createDiary(user: User, createDiaryDto: CreateDiaryDto) {
    const diary = await this.diaryRepository.findTodayDiary(user);

    if (diary) {
      throw new ConflictException('오늘 이미 작성한 일기가 있습니다');
    }

    return this.diaryRepository.insertDiary(user, createDiaryDto);
  }

  getDiary(user: User, diaryId: number) {
    return this.diaryRepository.getDiary(user, diaryId);
  }

  getDiaries(user: User, searchDiaryDto: SearchDiaryDto) {
    const { year, month } = searchDiaryDto;
    return this.diaryRepository.getDiaries(user, year, month);
  }
}
