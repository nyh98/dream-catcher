import {
  IsEmail,
  IsNumberString,
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator';

export class KakaoSignUpDto {
  @IsEmail()
  @IsOptional()
  email: string;

  @IsNumberString()
  uid: string;

  @IsString()
  name: string;

  @IsUrl()
  profileImg: string;

  provider: 'kakao' | 'google';
}

export class KakaoSignInDto {}
