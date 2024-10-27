import { ConflictException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { AuthService } from 'src/auth/auth.service';
import { SignUpDto } from 'src/auth/dto/sign-up';
import { UserRepository } from 'src/user/user.repository';

describe('회원가입 테스트', () => {
  let authService: AuthService;
  let userRepository: UserRepository;

  beforeEach(async () => {
    const userReposityoryMock = {
      insertUser: jest.fn((userData) => {
        return Promise.resolve({ ...userData, id: 1 });
      }),
      validateUserRegistration: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UserRepository, useValue: userReposityoryMock },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    userRepository = module.get<UserRepository>(UserRepository);
  });

  it('정상적인 회원가입', async () => {
    //given
    const user: SignUpDto = {
      name: '나용환',
      uid: '1234',
      provider: 'kakao',
      profileImg: 'http://testurl.com',
    };

    const responseValue = { id: 1, ...user };
    const signUpDto = plainToInstance(SignUpDto, user);
    const errors = await validate(signUpDto);

    //when
    const result = await authService.createUser(signUpDto);

    //then
    expect(errors.length).toBe(0);
    expect(result).toEqual(responseValue);
  });

  it('입력값이 비어 있으면 예외를 발생시킨다', async () => {
    //given
    const user = {
      name: '',
      uid: '',
      provider: '',
    };

    //when
    const signUpDto = plainToInstance(SignUpDto, user);
    const errors = await validate(signUpDto);

    //then
    const err = JSON.stringify(errors);
    expect(err).toContain('uid가 없습니다');
    expect(err).toContain('name이 없습니다');
    expect(err).toContain('profileImg가 없습니다');
    expect(err).toContain('유효하지 않은 provider');
  });

  it('유효하지 않은 형식이면 예외를 발생시킨다', async () => {
    //given
    const user = {
      name: 1234,
      uid: '123a45',
      provider: 'kakao',
      profileImg: '이미지에용',
    };

    //when
    const signUpDto = plainToInstance(SignUpDto, user);
    const errors = await validate(signUpDto);

    //then
    const err = JSON.stringify(errors);
    expect(err).toContain('유효하지 않은 uid');
    expect(err).toContain('profileImg가 URL형식이 아닙니다');
    expect(err).toContain('name은 문자열 이여야 합니다');
  });

  it('이미 가입한 회원이면 예외를 발생 시킨다', async () => {
    //given
    const user: SignUpDto = {
      name: '나용환',
      uid: '1234',
      provider: 'kakao',
      profileImg: 'http://testurl.com',
    };

    //when
    (userRepository.validateUserRegistration as jest.Mock).mockRejectedValue(
      new ConflictException('이미 가입된 유저 입니다'),
    );

    //then
    expect(authService.createUser(user)).rejects.toThrow(ConflictException);
    expect(authService.createUser(user)).rejects.toThrow(
      '이미 가입된 유저 입니다',
    );
  });
});
