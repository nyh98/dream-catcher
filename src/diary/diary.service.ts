import { Injectable } from '@nestjs/common';
import { CreateDiaryDto } from './dto/create-diary.dto';
import { UpdateDiaryDto } from './dto/update-diary.dto';
import { DiaryRepository } from './diary.repository';

@Injectable()
export class DiaryService {
  constructor(private readonly diaryRepository: DiaryRepository) {}
}
