import { Test, TestingModule } from '@nestjs/testing';
import { DiaryController } from '../../src/diary/diary.controller';
import { DiaryService } from '../../src/diary/diary.service';

describe('DiaryController', () => {
  let controller: DiaryController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DiaryController],
      providers: [DiaryService],
    }).compile();

    controller = module.get<DiaryController>(DiaryController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
