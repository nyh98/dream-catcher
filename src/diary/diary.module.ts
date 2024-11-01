import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { DiaryService } from './diary.service';
import { DiaryController } from './diary.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Diary } from './entities/diary.entity';
import { DiaryRepository } from './diary.repository';
import { AuthMiddleware } from 'src/auth/auth.middleware';
import { AuthModule } from 'src/auth/auth.module';
import { Tag } from './entities/tag.entity';
import { GptModule } from 'src/gpt/gpt.module';

@Module({
  imports: [TypeOrmModule.forFeature([Diary, Tag]), AuthModule, GptModule],
  controllers: [DiaryController],
  providers: [DiaryService, DiaryRepository],
})
export class DiaryModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes(DiaryController);
  }
}
