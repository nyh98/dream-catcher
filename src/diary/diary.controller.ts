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
  MessageEvent,
  Res,
  BadRequestException,
} from '@nestjs/common';
import { DiaryService } from './diary.service';
import { CreateDiaryDto } from './dto/create-diary.dto';
import {
  ApiBody,
  ApiHeader,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { User } from 'src/user/entities/user.entity';
import { GetUser } from 'src/custom/decorators/get-user.decorator';
import { AuthGuard } from 'src/auth/auth.guard';
import { SWAGGER_SUCCESS_RESPONSE_EXAMPLE } from 'src/constant/swaager-example';
import { SearchDiaryDto } from './dto/search-diary.dto';
import { UpdateDiaryDto } from './dto/update-diary.dto';
import { OneFieldRequiredPipe } from 'src/custom/pipes/one-field-required-pipe.ts';
import { Observable } from 'rxjs';
import { GptService } from 'src/gpt/gpt.service';
import { Response } from 'express';
import { DecodedDiaryDto } from './dto/decoded-diary.dto';
import { ChatCompletionChunk } from 'openai/resources';
import { Stream } from 'openai/streaming';
import { dir } from 'console';
import { OneFielDecodedDiaryPipe } from 'src/custom/pipes/one-field-decoded-diry-pipe';

@ApiTags('diaries')
@ApiHeader({
  name: 'Authorization',
  required: true,
  description: 'Bearer 토큰 필요 ex) Bearer abca23zf',
})
@UseGuards(AuthGuard)
@Controller('diaries')
export class DiaryController {
  constructor(
    private readonly diaryService: DiaryService,
    private readonly gptService: GptService,
  ) {}

  @ApiOperation({ summary: '일기 작성' })
  @ApiResponse(SWAGGER_SUCCESS_RESPONSE_EXAMPLE.createDiary)
  @Post()
  createDiary(
    @Body(OneFieldRequiredPipe) createDiaryDto: CreateDiaryDto,
    @GetUser() user: User,
  ) {
    return this.diaryService.createDiary(user, createDiaryDto);
  }

  @ApiOperation({ summary: '여러 일기 조회' })
  @ApiResponse(SWAGGER_SUCCESS_RESPONSE_EXAMPLE.getDiaries)
  @Get()
  async getDiaries(
    @Query() searchDiaryDto: SearchDiaryDto,
    @GetUser() user: User,
  ) {
    if (searchDiaryDto.type === 'calendar') {
      const { year, month } = searchDiaryDto;
      const diaries = await this.diaryService.getDiariesByCalendar(
        user,
        year,
        month,
      );
      return { diaries };
    }

    if (searchDiaryDto.type === 'list') {
      const { limit, page, text } = searchDiaryDto;
      const { diaries, totalCount } = await this.diaryService.getAllDiaries(
        user,
        limit,
        page,
        text,
      );

      return {
        diaries,
        currentPage: page,
        totalCount: Math.ceil(totalCount / limit),
      };
    }
  }

  @ApiOperation({ summary: '모든 태그들 조회' })
  @ApiResponse(SWAGGER_SUCCESS_RESPONSE_EXAMPLE.getTags)
  @Get('/tags')
  async getAllTags() {
    const tags = await this.diaryService.getAlltags();

    return { tags };
  }

  @ApiOperation({ summary: '꿈 해몽' })
  @ApiBody({
    type: DecodedDiaryDto,
    description:
      '자신이 쓴 일기 해몽할 경우는 id값만 필요, 즉각적 해몽은 content만 필요',
  })
  @Post('/interpretaion')
  async decodeDream(
    @Body(OneFielDecodedDiaryPipe) decodedDiaryDto: DecodedDiaryDto,
    @GetUser() user: User,
    @Res() res: Response,
  ): Promise<void> {
    let stream: Stream<ChatCompletionChunk>;

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    const { diaryId, content } = decodedDiaryDto;

    if (diaryId) {
      const diary = await this.diaryService.getDiary(user, diaryId);
      if (!diary) {
        throw new BadRequestException('존재하지 않는 일기');
      }
      stream = await this.gptService.decodeDream(
        JSON.stringify(diary.contents),
      );
    } else {
      stream = await this.gptService.decodeDream(content!);
    }

    const stack: string[] = [];
    for await (const chunk of stream) {
      const message = chunk.choices[0]?.delta?.content || '';
      console.log(message);
      stack.push(message);

      res.write(message);
    }

    if (decodedDiaryDto.diaryId) {
      await this.diaryService.insertDiaryInterpretaion(
        decodedDiaryDto.diaryId,
        stack.join(''),
      );
    }
    res.end();
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
