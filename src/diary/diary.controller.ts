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
import { GetUser } from 'src/custom/decorators/get-user.decorator';
import { AuthGuard } from 'src/auth/auth.guard';
import { SWAGGER_SUCCESS_RESPONSE_EXAMPLE } from 'src/constant';
import { SearchDiaryDto } from './dto/search-diary.dto';
import { UpdateDiaryDto } from './dto/update-diary.dto';
import { OneFieldRequiredPipe } from 'src/custom/pipes/diary-pipe';

@ApiTags('diaries')
@ApiHeader({
  name: 'Authorization',
  required: true,
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
    @Body(OneFieldRequiredPipe) createDiaryDto: CreateDiaryDto,
    @GetUser() user: User,
  ) {
    await this.diaryService.createDiary(user, createDiaryDto);
  }

  @ApiOperation({ summary: '여러 일기 조회' })
  @ApiResponse(SWAGGER_SUCCESS_RESPONSE_EXAMPLE.getDiaries)
  @Get()
  async getDiaries(@Query() query: SearchDiaryDto, @GetUser() user: User) {
    const diaries = await this.diaryService.getDiaries(user, query);
    return { diaries };
  }

  @ApiOperation({ summary: '모든 태그들 조회' })
  @ApiResponse(SWAGGER_SUCCESS_RESPONSE_EXAMPLE.getTags)
  @Get('/tags')
  async getAllTags() {
    const tags = await this.diaryService.getAlltags();

    return { tags };
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
  @ApiResponse(SWAGGER_SUCCESS_RESPONSE_EXAMPLE.updateDiary)
  @Patch()
  updateDiary(@Body() updateDiaryDto: UpdateDiaryDto, @GetUser() user: User) {
    return this.diaryService.updateDiary(user, updateDiaryDto);
  }

  @ApiOperation({ summary: '일기 삭제' })
  @Delete('/:diaryid')
  deleteDiary(
    @Param('diaryid', ParseIntPipe) diaryId: number,
    @GetUser() user: User,
  ) {
    return this.diaryService.deleteDiary(user, diaryId);
  }
}
