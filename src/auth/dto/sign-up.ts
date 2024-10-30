import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PROVIDER_GROUP } from '../../constant/swaager-example';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator';

export class SignUpDto {
  @ApiPropertyOptional({ description: '필수 아님', example: 'abc@abc.com' })
  @IsEmail({}, { message: '이메일 형식이 아닙니다' })
  @IsOptional()
  email?: string;

  @ApiProperty({ example: '123456' })
  @IsNumberString({}, { message: '유효하지 않은 uid' })
  @IsNotEmpty({ message: 'uid가 없습니다' })
  uid: string;

  @ApiProperty({ example: '나용환' })
  @IsString({ message: 'name은 문자열 이여야 합니다' })
  @IsNotEmpty({ message: 'name이 없습니다' })
  name: string;

  @ApiProperty({ example: 'http://aaaa.com' })
  @IsUrl({}, { message: 'profileImg가 URL형식이 아닙니다' })
  @IsNotEmpty({ message: 'profileImg가 없습니다' })
  profileImg: string;

  @ApiProperty({ example: 'kakao' })
  @IsEnum(PROVIDER_GROUP, { message: '유효하지 않은 provider' })
  provider: keyof typeof PROVIDER_GROUP;
}

export class SignInDto {}
