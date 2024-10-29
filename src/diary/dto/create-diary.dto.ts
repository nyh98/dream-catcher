import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
  IsIn,
  IsInstance,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { templateTpyes, TemplateType } from 'src/custom/types/types';

class Section {
  @ApiProperty()
  @IsString({ message: 'section은 문자열 이여야 합니다' })
  @IsNotEmpty({ message: 'section은 비어있을수 없습니다' })
  section: string;

  @ApiProperty()
  @IsString({ message: 'detail은 문자열 이여야 합니다' })
  @IsNotEmpty({ message: 'detail은 비어있을수 없습니다' })
  detail: string;
}

export class ContentDto {
  @ApiProperty({
    required: false,
    type: Section,
    example: '[{ section: 등장 인물, detail: 나용환 }] | null',
  })
  @IsOptional()
  @IsArray({ message: 'sections 리스트 형식이여야 합니다' })
  @ArrayNotEmpty({ message: 'sections 리스트가 비어있습니다' })
  @ValidateNested({ each: true, message: '유효하지 않은 sections 형식' })
  @Type(() => Section)
  sections?: Section[] | null = null;

  @ApiProperty({
    required: false,
    example: 'string | null',
    type: String,
  })
  @IsNotEmpty()
  @IsString()
  @IsOptional()
  freeContent?: string | null = null;
}

export class CreateDiaryDto {
  @ApiProperty()
  @IsString({ message: 'title은 문자열 이여야 합니다' })
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: "'beginner' | 'expert' | 'free'" })
  @IsIn(templateTpyes, { message: '유효하지 않은 템플릿 타입 입니다' })
  templateType: TemplateType;

  @ApiProperty({ type: ContentDto })
  @IsNotEmpty()
  @IsObject()
  @IsInstance(ContentDto, { message: 'te' })
  @ValidateNested({ each: true, message: '유효하지 않은 content 형식' })
  @Type(() => ContentDto)
  content: ContentDto;

  @ApiProperty({ required: false, type: ['string'], example: ['악몽'] })
  @IsOptional()
  @IsArray({ message: 'tag는 리스트 형식이여야 합니다' })
  @ArrayNotEmpty({ message: 'tag 리스트가 비어있습니다' })
  @IsString({ each: true, message: 'tag는 문자열 이여야 합니다' })
  tags?: string[];
}
