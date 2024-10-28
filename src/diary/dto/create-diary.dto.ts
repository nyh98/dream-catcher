import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

export class ContentDto {
  @ApiProperty()
  @IsString({ message: 'section은 문자열 이여야 합니다' })
  section: string;

  @ApiProperty()
  @IsString({ message: 'detail은 문자열 이여야 합니다' })
  detail: string;
}

export class CreateDiaryDto {
  @ApiProperty()
  @IsString({ message: 'title은 문자열 이여야 합니다' })
  @IsNotEmpty()
  title: string;

  @ApiProperty({ type: [ContentDto] })
  @IsArray({ message: 'content는 리스트 형식이여야 합니다' })
  @ArrayNotEmpty({ message: 'content 리스트가 비어있습니다' })
  @ValidateNested({ each: true })
  @Type(() => ContentDto)
  content: ContentDto[];

  @ApiProperty({ required: false, type: ['string'], example: ['악몽'] })
  @IsOptional()
  @IsArray({ message: 'tag는 리스트 형식이여야 합니다' })
  @ArrayNotEmpty({ message: 'tag 리스트가 비어있습니다' })
  @IsString({ each: true, message: 'tag는 문자열 이여야 합니다' })
  tags?: string[];
}
