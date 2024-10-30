import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateDiaryDto } from './dto/create-diary.dto';
import { DiaryRepository } from './diary.repository';
import { User } from 'src/user/entities/user.entity';
import { UpdateDiaryDto } from './dto/update-diary.dto';

@Injectable()
export class DiaryService {
  constructor(private readonly diaryRepository: DiaryRepository) {}

  async createDiary(user: User, createDiaryDto: CreateDiaryDto) {
    return this.diaryRepository.insertDiary(user, createDiaryDto);
  }

  getDiary(user: User, diaryId: number) {
    return this.diaryRepository.getDiary(user, diaryId);
  }

  getDiariesByCalendar(user: User, year?: number, month?: number) {
    return this.diaryRepository.getDiariesByCalendar(user, year, month);
  }

  getAllDiaries(user: User, limit: number, page: number, text?: string) {
    return this.diaryRepository.getAllDiaries(user, limit, page, text);
  }

  getAlltags() {
    return this.diaryRepository.getAlltags();
  }

  async updateDiary(user: User, updateDiaryDto: UpdateDiaryDto) {
    const diary = await this.diaryRepository.getDiary(
      user,
      updateDiaryDto.diaryId,
    );

    if (!diary) {
      throw new NotFoundException('존재하지 않는 diaryId 입니다');
    }

    return this.diaryRepository.updateDiary(diary, updateDiaryDto);
  }

  async deleteDiary(user: User, diaryId: number) {
    const diary = await this.diaryRepository.getDiary(user, diaryId);

    if (!diary) {
      throw new NotFoundException('존재하지 않는 diaryId 입니다');
    }

    await this.diaryRepository.remove(diary);
  }
}
