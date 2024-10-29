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
      const { content } = value;
      console.log(content);
      if (!content.freeContent && !content.sections) {
        throw new BadRequestException(
          'sections와 freeContent중 하나의 필드는 존재해야 합니다',
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
