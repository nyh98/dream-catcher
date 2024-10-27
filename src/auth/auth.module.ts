import { UserRepository } from './../user/user.repository';
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from 'src/user/user.module';
import { AuthMiddleware } from './auth.middleware';

@Module({
  imports: [UserModule],
  controllers: [AuthController],
  providers: [AuthService, UserRepository, AuthMiddleware],
  exports: [AuthMiddleware, AuthService],
})
export class AuthModule {}
