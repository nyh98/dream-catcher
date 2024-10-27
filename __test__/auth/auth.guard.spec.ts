import { ExecutionContext } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { Request } from 'express';

describe('인가 가드 테스트', () => {
  let authGuard: AuthGuard;
  let mockExecutionContext: ExecutionContext;
  let mockRequest: Request;

  beforeEach(async () => {
    authGuard = new AuthGuard();
    mockExecutionContext = {
      switchToHttp: () => ({
        getRequest: () => mockRequest,
      }),
    } as ExecutionContext;
    mockRequest = {} as Request;
  });

  it('req.user 가 존재하면 true를 반환한다', () => {
    //given
    mockRequest.user = {
      id: 1,
      name: '나용환',
      uid: '1234',
      provider: 'kakao',
      profileImg: 'http://testurl.com',
      email: 'abc@abc.com',
      diarys: [],
    };

    //when
    const result = authGuard.canActivate(mockExecutionContext);

    //then
    expect(result).toBe(true);
  });

  it('req.user 가 존재하지 않으면 예외를 발생시킨다', () => {
    const result = authGuard.canActivate(mockExecutionContext);

    expect(result).toBe(false);
  });
});
