import {
  Controller,
  Post,
  Body,
  Delete,
  Patch,
  Get,
  UseGuards,
  Param,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { DiaryService } from './diary.service';
import { CreateDiaryDto } from './dto/create-diary.dto';
import { ApiHeader, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { User } from 'src/user/entities/user.entity';
import { GetUser } from 'src/decorators/get-user.decorator';
import { AuthGuard } from 'src/auth/auth.guard';
import { SWAGGER_SUCCESS_RESPONSE_EXAMPLE } from 'src/constant';
import { SearchDiaryDto } from './dto/search-diary.dto';

@ApiTags('diaries')
@ApiHeader({
  name: 'Authorization',
  description:
    'Bearer 토큰 필요 ex) Bearer abca23zf 임시로 Bearer userId로 주세용',
})
@UseGuards(AuthGuard)
@Controller('diaries')
export class DiaryController {
  constructor(private readonly diaryService: DiaryService) {}

  @ApiOperation({ summary: '일기 작성' })
  @Post()
  async createDiary(
    @Body() createDiaryDto: CreateDiaryDto,
    @GetUser() user: User,
  ) {
    await this.diaryService.createDiary(user, createDiaryDto);
  }

  @ApiOperation({ summary: '여러 일기 조회' })
  @Get()
  getDiarys(@Query() query: SearchDiaryDto, @GetUser() user: User) {
    return this.diaryService.getDiarys(user, query);
  }

  @ApiOperation({ summary: '단일 일기 조회' })
  @ApiResponse(SWAGGER_SUCCESS_RESPONSE_EXAMPLE.getDiary)
  @Get('/:diaryid')
  getDiary(
    @Param('diaryid', ParseIntPipe) diaryId: number,
    @GetUser() user: User,
  ) {
    return this.diaryService.getDiary(user, diaryId);
  }

  @ApiOperation({ summary: '일기 수정' })
  @Patch()
  updateDiary() {}

  @ApiOperation({ summary: '일기 삭제' })
  @Delete()
  deleteDiary() {}
}
