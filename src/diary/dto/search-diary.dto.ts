import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsNumberString, IsOptional } from 'class-validator';

export class SearchDiaryDto {
  @ApiProperty({
    required: false,
    description: '조회할 년도',
    default: '현재 년도',
  })
  @IsNumber()
  @IsOptional()
  year?: number;

  @ApiProperty({ required: false, default: '현재 달' })
  @IsNumber()
  @IsOptional()
  month?: number;
}
