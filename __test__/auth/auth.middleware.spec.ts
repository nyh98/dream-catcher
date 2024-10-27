import { Test, TestingModule } from '@nestjs/testing';
import { NextFunction, Request, Response } from 'express';
import { AuthMiddleware } from 'src/auth/auth.middleware';
import { AuthService } from 'src/auth/auth.service';

describe('인증 미들웨어 테스트', () => {
  let authMiddleware: AuthMiddleware;
  let mockResponse: Response;
  let mockNext: NextFunction;

  const user = { id: 1, name: '나용환' };

  beforeEach(async () => {
    mockResponse = {} as Response;
    mockNext = jest.fn();

    const authServiceMock = {
      validKakaoToken: jest.fn().mockResolvedValue(user),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthMiddleware,
        { provide: AuthService, useValue: authServiceMock },
      ],
    }).compile();

    authMiddleware = module.get<AuthMiddleware>(AuthMiddleware);
  });

  it('유효한 인증이면 req.user에 데이터가 있어야 한다', async () => {
    //given
    const mockRequest = {
      headers: { authorization: 'Bearer token' },
    } as Request;

    //when
    await authMiddleware.use(mockRequest, mockResponse, mockNext);

    //then
    expect(mockRequest.user).toEqual(user);
    expect(mockRequest.user).not.toBeUndefined();
  });

  it('header에 인증 정보가 없으면 req.user는 undefined이다', async () => {
    //given
    const notAuthorizationReq = { headers: { authorization: '' } } as Request;
    const notSchemeReq = { headers: { authorization: 'token' } } as Request;

    //when
    await authMiddleware.use(notAuthorizationReq, mockResponse, mockNext);
    await authMiddleware.use(notSchemeReq, mockResponse, mockNext);

    //then
    expect(notAuthorizationReq.user).toBeUndefined();
    expect(notSchemeReq.user).toBeUndefined();
  });
});
