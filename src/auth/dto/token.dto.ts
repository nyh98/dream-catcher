import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class RefreshTokenDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'refreshToken이 없습니다' })
  @IsString({ message: 'refreshToken은 문자열 이여야 합니다' })
  refreshToken: string;
}
