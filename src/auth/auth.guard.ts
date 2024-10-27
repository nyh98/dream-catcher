import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Request } from 'express';
import { Observable } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(
    ctx: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const req = ctx.switchToHttp().getRequest<Request>();
    const user = req.user;

    if (user) {
      return true;
    }

    return false;
  }
}
