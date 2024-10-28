import { ConflictException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { DiaryRepository } from 'src/diary/diary.repository';
import { DiaryService } from 'src/diary/diary.service';
import { CreateDiaryDto } from 'src/diary/dto/create-diary.dto';
import { SearchDiaryDto } from 'src/diary/dto/search-diary.dto';
import { UpdateDiaryDto } from 'src/diary/dto/update-diary.dto';
import { Diary } from 'src/diary/entities/diary.entity';
import { User } from 'src/user/entities/user.entity';

describe('일기 테스트', () => {
  let diaryService: DiaryService;
  let diaryRepository: DiaryRepository;
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
    const mockDiaryRepository = {
      insertDiary: jest.fn(),
      findTodayDiary: jest.fn(),
      getDiary: jest.fn(),
      getDiaries: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DiaryService,
        { provide: DiaryRepository, useValue: mockDiaryRepository },
      ],
    }).compile();

    diaryService = module.get<DiaryService>(DiaryService);
    diaryRepository = module.get<DiaryRepository>(DiaryRepository);
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
    diaryRepository.findTodayDiary = jest
      .fn()
      .mockResolvedValue({ id: 1, title: '제목' });

    expect(diaryService.createDiary(user, input)).rejects.toThrow(
      ConflictException,
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

  it('정상적인 단일 일기 조회', async () => {
    //given
    const diaryId = 10;
    const diary = {
      id: 10,
      title: '제목',
      contents: [{ seciton: '섹션', detail: '내용' }],
      image: 'http://image.com',
      interpretation: '해몽내용',
      createdAt: '2024-10-28 04:46:59.769356',
    };

    diaryRepository.getDiary = jest.fn().mockResolvedValue(diary);

    //when
    const result = await diaryService.getDiary(user, diaryId);

    //then
    expect(result).toEqual(diary);
  });

  it('일기 id가 존재하지 않는 경우 null 반환', async () => {
    //given
    const diaryId = 990;
    diaryRepository.getDiary = jest.fn().mockResolvedValue(null);

    //when
    const result = await diaryService.getDiary(user, diaryId);

    //then
    expect(result).toBeNull();
  });

  it('여러일기 조회 성공 케이스', async () => {
    //given
    const searchDto: SearchDiaryDto = { year: 2024, month: 10 };
    const emptyDto = {}; //검색 옵션이 없으면 현재 년월로 조회
    const resultDiaries = [
      {
        id: 10,
        title: '제목',
        contents: [{ seciton: '섹션', detail: '내용' }],
        image: 'http://image.com',
        interpretation: '해몽내용',
        createdAt: '2024-10-28 04:46:59.769356',
      },
    ];
    diaryRepository.getDiaries = jest.fn().mockResolvedValue(resultDiaries);

    //when
    const existDtoResult = await diaryService.getDiaries(user, searchDto);
    const emptyDtoResult = await diaryService.getDiaries(user, emptyDto);

    //then
    expect(existDtoResult).toEqual(resultDiaries);
    expect(emptyDtoResult).toEqual(resultDiaries);
  });

  it('여러 일기 조회시 년월에 대한 데이터가 없는 경우 빈배열을 반환한다', async () => {
    //given
    const searchDto: SearchDiaryDto = { year: 2555, month: 15 };

    diaryRepository.getDiaries = jest.fn().mockResolvedValue([]);

    //when
    const result = await diaryService.getDiaries(user, searchDto);

    //then
    expect(result).toEqual([]);
  });

  it('일기 수정 성공 케이스', async () => {
    //given
    const updateDto: UpdateDiaryDto = {
      diaryId: 10,
      title: '변경된 재목',
      content: [{ section: '변경 섹션1', detail: '변경 내용1' }],
    };

    const beforeDiary: Diary = {
      id: 10,
      title: '제목',
      contents: "[{ section: '기존 섹션', detail: '기존 내용' }]",
      image: 'http://image.com',
      interpretation: '해몽 내용',
      createdAt: new Date(),
      user,
    };

    const afterDiary: Diary = {
      id: 10,
      title: '변경된 재목',
      contents: "[{ section: '변경 섹션1', detail: '변경 내용1' }]",
      image: 'http://image.com',
      interpretation: '해몽 내용',
      createdAt: new Date(),
      user,
    };

    diaryRepository.getDiary = jest.fn().mockResolvedValue(beforeDiary);
    diaryRepository.updateDiary = jest.fn().mockResolvedValue(afterDiary);

    //when
    const updateDiaryDto = plainToInstance(UpdateDiaryDto, updateDto);
    const errors = await validate(updateDiaryDto);
    const result = await diaryService.updateDiary(user, updateDto);

    //then
    expect(errors.length).toBe(0);
    expect(result).toEqual(afterDiary);
  });

  it('수정하려는 일기가 없으면 예외가 발생한다', () => {
    //given
    const updateDto: UpdateDiaryDto = {
      diaryId: 999,
      title: '변경된 재목',
      content: [{ section: '변경 섹션1', detail: '변경 내용1' }],
    };

    diaryRepository.getDiary = jest.fn().mockResolvedValue(null);

    //when & then
    expect(diaryService.updateDiary(user, updateDto)).rejects.toThrow(
      NotFoundException,
    );
  });

  it('일기 삭제시 존재하지 않는 diaryId면 예외가 발생한다', () => {
    //given
    const diaryId = 999;

    diaryRepository.getDiary = jest.fn().mockResolvedValue(null);

    //when & then
    expect(diaryService.deleteDiary(user, diaryId)).rejects.toThrow(
      NotFoundException,
    );
  });
});
