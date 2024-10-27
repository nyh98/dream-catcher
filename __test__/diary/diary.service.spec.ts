import { Test, TestingModule } from '@nestjs/testing';
import { DiaryService } from 'src/diary/diary.service';

describe('DiaryService', () => {
  let diaryService: DiaryService;

  beforeEach(async () => {
    const diaryServiceMock = {
      createDiary: jest.fn(() => {}),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [{ provide: DiaryService, useValue: diaryServiceMock }],
    }).compile();

    diaryService = module.get<DiaryService>(DiaryService);
  });

  it('정상적인 일기 작성', () => {
    //given
    const input = {
      title: '제목',
      content: [
        { section: '섹션1', detail: 'ㅁㄴㅇ' },
        { section: '섹션1', detail: '섹션1' },
      ],
    };
    const user = { id: 1 };
    //when
    //then
  });
});
