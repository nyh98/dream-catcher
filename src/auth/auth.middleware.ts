import {
  BadRequestException,
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { AuthService } from './auth.service';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly authService: AuthService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const credentials = req.headers.authorization;

    if (!credentials) {
      throw new BadRequestException('인증 정보가 없습니다');
    }

    const [authScheme, token] = credentials.split(' ');

    if (authScheme === 'Bearer' && token) {
      //임시 로직
      const userId = Number(token);
      if (userId) {
        const user = await this.authService.getUserById(userId);
        user && (req.user = user);
        return next();
      }
      //토큰 검증
      const tokenData = await this.authService.validKakaoToken(token);
      console.log('tokenData', tokenData);
      const user = await this.authService.getKakaoUser(tokenData.id.toString());
      console.log(user);
      user && (req.user = user);
      return next();
    }

    next();
  }
}
