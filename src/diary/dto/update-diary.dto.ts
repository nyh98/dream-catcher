import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateDiaryDto } from './create-diary.dto';
import { IsNumber } from 'class-validator';

export class UpdateDiaryDto extends PartialType(CreateDiaryDto) {
  @ApiProperty({ example: 6 })
  @IsNumber()
  diaryId: number;
}
