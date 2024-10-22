import { Controller, Post, Body } from '@nestjs/common';
import { DiaryService } from './diary.service';
import { CreateDiaryDto } from './dto/create-diary.dto';

@Controller('diarys')
export class DiaryController {
  constructor(private readonly diaryService: DiaryService) {}

  @Post()
  createDiary(@Body() createDiaryDto: CreateDiaryDto) {}
}
