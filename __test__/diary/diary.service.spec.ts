import { ConflictException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { DiaryService } from 'src/diary/diary.service';
import { CreateDiaryDto } from 'src/diary/dto/create-diary.dto';
import { User } from 'src/user/entities/user.entity';

describe('일기 작성 테스트', () => {
  let diaryService: DiaryService;
  let input = {
    title: '제목',
    content: [
      { section: '섹션1', detail: 'ㅁㄴㅇ' },
      { section: '섹션1', detail: '섹션1' },
    ],
  };

  let user: User = {
    id: 1,
    name: '사용자 이름',
    email: 'user@example.com',
    profileImg: 'http://example.com/image.jpg',
    provider: 'kakao',
    uid: '12345',
    diarys: [],
  };

  beforeEach(async () => {
    const diaryServiceMock = {
      createDiary: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [{ provide: DiaryService, useValue: diaryServiceMock }],
    }).compile();

    diaryService = module.get<DiaryService>(DiaryService);
  });

  it('정상적인 일기 작성', async () => {
    //given
    const createDiaryDto = plainToInstance(CreateDiaryDto, input);
    const errors = await validate(createDiaryDto);

    //when
    const result = await diaryService.createDiary(user, input);

    //then
    expect(errors.length).toBe(0);
    expect(result).toBe(undefined);
  });

  it('오늘 작성한 일기가 있으면 예외가 발생한다', async () => {
    //when
    (diaryService.createDiary as jest.Mock).mockRejectedValue(
      new ConflictException('오늘 작성한 일기가 있습니다'),
    );

    //then
    expect(diaryService.createDiary(user, input)).rejects.toThrow(
      ConflictException,
    );
    expect(diaryService.createDiary(user, input)).rejects.toThrow(
      '오늘 작성한 일기가 있습니다',
    );
  });

  it('유효하지 않은 형식이면 예외가 발생한다', async () => {
    //given
    const notArrayContnet = {
      title: '제목',
      content: { section: '섹션1', detail: 'ㅁㄴㅇ' },
    };

    const invalidInput = {
      title: 123,
      content: [{ section: 123, detail: 'ㅁㄴㅇ' }],
    };

    //when
    const notArrayError = plainToInstance(CreateDiaryDto, notArrayContnet);
    const invalidErrors = plainToInstance(CreateDiaryDto, invalidInput);
    const arrayErr = await validate(notArrayError);
    const invalidErr = await validate(invalidErrors);

    //then
    expect(JSON.stringify(arrayErr)).toContain(
      'content는 리스트 형식이여야 합니다',
    );
    expect(JSON.stringify(invalidErr)).toContain(
      'section은 문자열 이여야 합니다',
    );
    expect(JSON.stringify(invalidErr)).toContain(
      'title은 문자열 이여야 합니다',
    );
  });
});
