import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PROVIDER_GROUP } from '../../constant/index';
import {
  IsEmail,
  IsEnum,
  IsNumberString,
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator';

export class SignUpDto {
  @ApiPropertyOptional({ description: '필수 아님', example: 'abc@abc.com' })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiProperty({ example: '123456' })
  @IsNumberString()
  uid: string;

  @ApiProperty({ example: '나용환' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'http://aaaa' })
  @IsUrl()
  profileImg: string;

  @ApiProperty({ example: 'kakao' })
  @IsEnum(PROVIDER_GROUP)
  provider: keyof typeof PROVIDER_GROUP;
}

export class SignInDto {}
