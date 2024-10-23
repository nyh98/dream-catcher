import { Controller, Post, Body, Delete, Patch, Get } from '@nestjs/common';
import { DiaryService } from './diary.service';
import { CreateDiaryDto } from './dto/create-diary.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('diaries')
@Controller('diaries')
export class DiaryController {
  constructor(private readonly diaryService: DiaryService) {}

  @ApiOperation({ summary: '일기 작성' })
  @Post()
  createDiary(@Body() createDiaryDto: CreateDiaryDto) {}

  @ApiOperation({ summary: '여러 일기 조회' })
  @Get()
  getDiarys() {}

  @ApiOperation({ summary: '단일 일기 조회' })
  @Get('/:diaryid')
  getDiary() {}

  @ApiOperation({ summary: '일기 수정' })
  @Patch()
  updateDiary() {}

  @ApiOperation({ summary: '일기 삭제' })
  @Delete()
  deleteDiary() {}
}
