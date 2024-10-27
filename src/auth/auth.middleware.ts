import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class authMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const credentials = req.headers.authorization;

    if (!credentials) {
      return next();
    }

    const [authScheme, token] = credentials.split(' ');

    if (authScheme === 'Bearer' && token) {
      console.log(authScheme, token);
      //토큰 검증 로직 추가하기
    }

    next();
  }
}
