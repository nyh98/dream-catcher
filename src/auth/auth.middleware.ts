import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { AuthService } from './auth.service';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly authService: AuthService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const credentials = req.headers.authorization;

    if (!credentials) {
      return next();
    }

    const [authScheme, token] = credentials.split(' ');

    if (authScheme === 'Bearer' && token) {
      //토큰 검증 로직 추가하기

      //임시 로직
      const user = await this.authService.validKakaoToken(Number(token));
      user && (req.user = user);
    }

    next();
  }
}
