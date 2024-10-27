import * as express from 'express';
import { User } from 'src/decorators/get-user.decorator';
import { User } from 'src/user/entities/user.entity';

declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}
