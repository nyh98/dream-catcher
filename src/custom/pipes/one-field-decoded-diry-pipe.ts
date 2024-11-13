import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  PipeTransform,
} from '@nestjs/common';
import { CreateDiaryDto } from 'src/diary/dto/create-diary.dto';
import { DecodedDiaryDto } from 'src/diary/dto/decoded-diary.dto';

@Injectable()
export class OneFielDecodedDiaryPipe implements PipeTransform {
  transform(value: DecodedDiaryDto, metadata: ArgumentMetadata) {
    try {
      if (!value.diaryId && !value.content) {
        throw new BadRequestException('diaryId 또는 content 가 없습니다');
      }

      return value;
    } catch (e) {
      if (e instanceof BadRequestException) {
        throw e;
      }

      console.error('OneFielDecodedDiaryPipe 사용처가 잘못됨', e);
      throw new InternalServerErrorException();
    }
  }
}
