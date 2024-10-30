import { HttpService } from '@nestjs/axios';
import { ConflictException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { AuthService } from 'src/auth/auth.service';
import { SignUpDto } from 'src/auth/dto/sign-up';
import { DecodedKakaoToken } from 'src/types/types';
import { UserRepository } from 'src/user/user.repository';

describe('회원가입 테스트', () => {
  let authService: AuthService;
  let userRepository: UserRepository;

  beforeEach(async () => {
    const userReposityoryMock = {
      save: jest.fn(),
      create: jest.fn(),
    };
    const mockHttpService = {
      get: jest.fn(),
      post: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UserRepository, useValue: userReposityoryMock },
        { provide: HttpService, useValue: mockHttpService },
        { provide: ConfigService, useValue: {} },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    userRepository = module.get<UserRepository>(UserRepository);
  });

  it('정상적인 회원가입', async () => {
    //given
    const user: DecodedKakaoToken = {
      id: 233045,
      properties: {
        nickname: '나용환',
        profile_image: 'http://image.com',
        thumbnail_image: 'http://image.com',
      },
    } as DecodedKakaoToken;

    const responseValue = { ...user, uid: user.id, id: 1 };
    userRepository.save = jest.fn().mockResolvedValue(responseValue);

    //when
    const result = await authService.createKakaoUser(user);

    //then
    expect(result).toEqual(responseValue);
  });
});
