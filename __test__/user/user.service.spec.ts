import { Test, TestingModule } from '@nestjs/testing';
import { UserRepository } from 'src/user/user.repository';
import { UserService } from 'src/user/user.service';

describe('유저 테스트', () => {
  let userService: UserService;
  let userRepository: UserRepository;
  beforeEach(async () => {
    const mockUserReposotory = {
      findOne: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        { provide: UserRepository, useValue: mockUserReposotory },
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
    userRepository = module.get<UserRepository>(UserRepository);
  });
});
