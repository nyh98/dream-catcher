import { Test, TestingModule } from '@nestjs/testing';
import { NextFunction, Request, Response } from 'express';
import { AuthMiddleware } from 'src/auth/auth.middleware';
import { AuthService } from 'src/auth/auth.service';
import { UserRepository } from 'src/user/user.repository';

describe('인증 미들웨어 테스트', () => {
  let authMiddleware: AuthMiddleware;
  let mockResponse: Response;
  let mockNext: NextFunction;
  let userRepository: UserRepository;
  let authService: AuthService;

  const user = { id: 1, name: '나용환' };

  beforeEach(async () => {
    mockResponse = {} as Response;
    mockNext = jest.fn();
    userRepository = {} as UserRepository;
    authService = new AuthService(userRepository);
    authMiddleware = new AuthMiddleware(authService);
  });

  it('유효한 인증이면 req.user에 데이터가 있어야 한다', async () => {
    //given
    const mockRequest = {
      headers: { authorization: 'Bearer token' },
    } as Request;

    authService.validKakaoToken = jest.fn().mockResolvedValue(user);

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
    expect(notAuthorizationReq.user).toBe(undefined);
    expect(notSchemeReq.user).toBe(undefined);
  });
});
