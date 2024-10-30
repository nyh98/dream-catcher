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
  let input: CreateDiaryDto = {
    title: '제목',
    templateType: 'beginner',
    content: {
      sections: [
        { section: '섹션1', detail: 'ㅁㄴㅇ' },
        { section: '섹션1', detail: '섹션1' },
      ],
    },
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

  it('유효하지 않은 형식이면 예외가 발생한다', async () => {
    //given
    const invalidInput = {
      title: 123,
      content: { sections: [{ section: '섹션1', detail: 123 }] },
      templateType: 'no',
    };

    //when
    const invalidErrors = plainToInstance(CreateDiaryDto, invalidInput);
    const invalidErr = await validate(invalidErrors);

    //then
    const err = JSON.stringify(invalidErr);
    expect(err).toContain('detail은 문자열 이여야 합니다');
    expect(err).toContain('title은 문자열 이여야 합니다');
    expect(err).toContain('유효하지 않은 템플릿 타입 입니다');
  });

  it('정상적인 단일 일기 조회', async () => {
    //given
    const diaryId = 10;
    const diary = {
      id: 10,
      title: '제목',
      contents: { sections: [{ sections: '섹션1', detail: '내용1' }] },
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

  it('년월 기준 일기들 조회 성공 케이스', async () => {
    //given
    const searchDto: SearchDiaryDto = {
      type: 'calendar',
      year: 2024,
      month: 10,
    } as SearchDiaryDto;
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
    diaryRepository.getDiariesByCalendar = jest
      .fn()
      .mockResolvedValue(resultDiaries);

    //when
    const existDtoResult = await diaryService.getDiariesByCalendar(
      user,
      searchDto.year,
      searchDto.month,
    );
    const emptyDtoResult = await diaryService.getDiariesByCalendar(user);

    //then
    expect(existDtoResult).toEqual(resultDiaries);
    expect(emptyDtoResult).toEqual(resultDiaries);
  });

  it('년월 일기 조회시 년월에 대한 데이터가 없는 경우 빈배열을 반환한다', async () => {
    //given
    const searchDto: SearchDiaryDto = {
      type: 'calendar',
      year: 2555,
      month: 15,
    } as SearchDiaryDto;

    diaryRepository.getDiariesByCalendar = jest.fn().mockResolvedValue([]);

    //when
    const result = await diaryService.getDiariesByCalendar(
      user,
      searchDto.year,
      searchDto.month,
    );

    //then
    expect(result).toEqual([]);
  });

  it('리스트 형식 일기 조회 성공 케이스', async () => {
    //given
    const searchDto: SearchDiaryDto = {
      type: 'list',
      limit: 2,
      page: 1,
    };
    const response = {
      diaries: [{ title: '제목', content: [{}] }],
      limit: 2,
      totalPage: 10,
    };

    diaryRepository.getAllDiaries = jest.fn().mockResolvedValue(response);
    //when
    const result = await diaryService.getAllDiaries(
      user,
      searchDto.limit,
      searchDto.page,
    );

    //then
    expect(result).toEqual(response);
  });

  it('일기 수정 성공 케이스', async () => {
    //given
    const updateDto: UpdateDiaryDto = {
      diaryId: 10,
      title: '변경된 재목',
      content: {
        sections: [
          { section: '섹션1', detail: 'ㅁㄴㅇ' },
          { section: '섹션1', detail: '섹션1' },
        ],
      },
    };

    const beforeDiary: Diary = {
      id: 10,
      title: '제목',
      contents: "[{ section: '기존 섹션', detail: '기존 내용' }]",
      image: 'http://image.com',
      interpretation: '해몽 내용',
      createdAt: new Date(),
      user,
    } as Diary;

    const afterDiary: Diary = {
      id: 10,
      title: '변경된 재목',
      contents: "[{ section: '변경 섹션1', detail: '변경 내용1' }]",
      image: 'http://image.com',
      interpretation: '해몽 내용',
      createdAt: new Date(),
      user,
    } as Diary;

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
      content: {
        sections: [
          { section: '섹션1', detail: 'ㅁㄴㅇ' },
          { section: '섹션1', detail: '섹션1' },
        ],
      },
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
