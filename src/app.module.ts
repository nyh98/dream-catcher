import { Module } from '@nestjs/common';
import { DbModule } from './db/db.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { DiaryModule } from './diary/diary.module';

@Module({
  imports: [AuthModule, UserModule, DbModule, DiaryModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
