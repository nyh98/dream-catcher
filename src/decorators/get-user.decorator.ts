import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

export const getUser = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest<Request>();
    const user = req.user;

    if (data) {
      return user[data];
    }

    return user;
  },
);
