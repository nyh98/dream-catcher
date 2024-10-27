import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
  IsString,
  ValidateNested,
} from 'class-validator';

export interface Content {
  section: string;
  detail: string;
}

class ContentDto implements Content {
  @ApiProperty()
  @IsString({ message: 'section은 문자열 이여야 합니다' })
  section: string;

  @ApiProperty()
  @IsString({ message: 'detail은 문자열 이여야 합니다' })
  detail: string;
}

export class CreateDiaryDto {
  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty({ type: [ContentDto] })
  @IsArray({ message: 'content는 리스트 형식이여야 합니다' })
  @ArrayNotEmpty({ message: '리스트가 비어있습니다' })
  @ValidateNested({ each: true })
  @Type(() => ContentDto)
  content: Content[];
}
