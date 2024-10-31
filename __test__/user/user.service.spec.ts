import {
  BadRequestException,
  FileTypeValidator,
  ParseFilePipe,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { AwsService } from 'src/aws/aws.service';
import { TemplateType } from 'src/types/types';
import { updateTemplateType } from 'src/user/dto/update-user.dto';
import { User } from 'src/user/entities/user.entity';
import { UserRepository } from 'src/user/user.repository';
import { UserService } from 'src/user/user.service';

describe('유저 테스트', () => {
  let userService: UserService;
  let userRepository: UserRepository;
  let awsService: AwsService;

  beforeEach(async () => {
    const mockUserReposotory = {
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
    };

    const mockAwsService = {
      deleteImageToS3: jest.fn(),
      imageUploadToS3: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        { provide: UserRepository, useValue: mockUserReposotory },
        { provide: AwsService, useValue: mockAwsService },
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
    userRepository = module.get<UserRepository>(UserRepository);
    awsService = module.get<AwsService>(AwsService);
  });

  it('정상적인 템플릿 수정', async () => {
    //given
    const input: TemplateType = 'Expert';
    const user: User = {
      id: 1,
      templateType: 'beginner',
    } as User;

    const afterUser: User = {
      id: 1,
      templateType: input,
    } as User;

    userRepository.save = jest.fn().mockResolvedValue(afterUser);

    //when
    const result = await userService.updateTemplate(user, input);

    //then
    expect(result).toEqual(afterUser);
  });

  it('유효하지 않은 템플릿 타입의 경우 에러 발생', async () => {
    //given
    const invalidType = 'SSL';
    const input = {
      type: invalidType,
    };
    //when
    const dto = plainToInstance(updateTemplateType, input);
    const errors = await validate(dto);

    //then
    expect(JSON.stringify(errors)).toContain('유효하지 않은 템플릿 형식');
  });

  it('정상적인 프로필 이미지 변경', async () => {
    //given
    const file: Express.Multer.File = {
      originalname: 'file.png',
      mimetype: 'imgae/png',
    } as Express.Multer.File;
    const url = `http://${file.originalname}`;
    const user = {
      id: 1,
      profileImg: 'currentImage.png',
    } as User;

    const afterUser = {
      id: 1,
      profileImg: url,
    };
    awsService.imageUploadToS3 = jest.fn().mockResolvedValue(url);

    userRepository.save = jest.fn().mockResolvedValue(afterUser);

    //when
    const result = await userService.updateProfile(user, file);

    //then
    expect(result).toEqual(afterUser);
  });

  it('파일이 이미지 형식이 아니면 예외 반환', async () => {
    //given
    const file: Express.Multer.File = {
      originalname: 'file.html',
      mimetype: 'text/html',
      buffer: Buffer.from(''), // 빈 버퍼로 초기화
      size: 100, // 테스트용 크기 설정
    } as Express.Multer.File;

    const pipe = new ParseFilePipe({
      fileIsRequired: false,
      validators: [new FileTypeValidator({ fileType: /image/ })],
    });

    // when & then
    expect(() => pipe.transform(file)).rejects.toThrow(BadRequestException);
  });
});
