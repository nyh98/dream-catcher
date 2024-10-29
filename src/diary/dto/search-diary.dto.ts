import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class SearchDiaryDto {
  @ApiProperty({ description: '조회할 타입', example: 'calender 또는 list' })
  @IsNotEmpty({ message: '조회 type을 지정해 주세요' })
  @IsIn(['calendar', 'list'], { message: 'type은 calendar 또는 list 입니다' })
  type: 'calendar' | 'list';

  @ApiProperty({
    required: false,
    description: '조회할 년도, type이 calender일 경우에만 유효',
    default: '현재 년도',
  })
  @IsNumber()
  @IsOptional()
  year?: number;

  @ApiProperty({
    required: false,
    description: '조회할 달 type이 calender일 경우에만 유효',
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
}
