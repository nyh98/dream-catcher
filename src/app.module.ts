import { Module } from '@nestjs/common';
import { DbModule } from './db/db.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { DiaryModule } from './diary/diary.module';
import { AwsModule } from './aws/aws.module';
import { GptModule } from './gpt/gpt.module';
import { StatisticsModule } from './statistics/statistics.module';

@Module({
  imports: [AuthModule, UserModule, DbModule, DiaryModule, AwsModule, GptModule, StatisticsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
