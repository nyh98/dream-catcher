import { ApiProperty } from '@nestjs/swagger';
import {
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { templateTpyes, TemplateType } from 'src/types/types';

export class SearchDiaryDto {
  @ApiProperty({ description: '조회할 타입', example: 'calendar 또는 list' })
  @IsNotEmpty({ message: '조회 type을 지정해 주세요' })
  @IsIn(['calendar', 'list'], { message: 'type은 calendar 또는 list 입니다' })
  type: 'calendar' | 'list';

  @ApiProperty({
    required: false,
    description: '조회할 년도, type이 calendar일 경우에만 유효',
    default: '현재 년도',
  })
  @IsNumber()
  @IsOptional()
  year?: number;

  @ApiProperty({
    required: false,
    description: '조회할 달 type이 calendar일 경우에만 유효',
    default: '현재 달',
  })
  @IsNumber()
  @IsOptional()
  month?: number;

  @ApiProperty({
    required: false,
    description: '조회할 일기 갯수 type이 list일 경우에만 유효',
    default: 10,
  })
  @IsNumber()
  @IsOptional()
  limit: number = 10;

  @ApiProperty({
    required: false,
    description: '조회할 페이지 type이 list일 경우에만 유효',
    default: 1,
  })
  @IsNumber()
  @IsOptional()
  page: number = 1;

  @ApiProperty({
    required: false,
    description: '제목 + 내용으로 조회 type이 list일 경우에만 유효',
  })
  @IsString()
  @IsOptional()
  text?: string;
}

export class GetSectionDto {
  @ApiProperty({
    description: '템플릿별 섹션들 조회',
    example: "'Beginner' | 'Expert' | 'Free'",
  })
  @IsIn(templateTpyes, { message: '유효하지 않은 템플릿 타입 입니다' })
  template: TemplateType;
}
