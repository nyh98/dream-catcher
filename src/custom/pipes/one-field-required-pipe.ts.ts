import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  PipeTransform,
} from '@nestjs/common';
import { CreateDiaryDto } from 'src/diary/dto/create-diary.dto';

@Injectable()
export class OneFieldRequiredPipe implements PipeTransform {
  transform(value: CreateDiaryDto, metadata: ArgumentMetadata) {
    try {
      const { contents } = value;

      if (!contents.freeContent && !contents.sections) {
        throw new BadRequestException(
          'content.sections 또는 content.freeContent 가 없습니다',
        );
      }

      return value;
    } catch (e) {
      if (e instanceof BadRequestException) {
        throw e;
      }

      console.error('OneFieldRequiredPipe의 사용처가 잘못됨', e);
      throw new InternalServerErrorException();
    }
  }
}
