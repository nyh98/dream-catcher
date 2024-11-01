import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class DecodedDiaryDto {
  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  diaryId?: number;

  @ApiProperty({ required: false })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  content?: string;
}
