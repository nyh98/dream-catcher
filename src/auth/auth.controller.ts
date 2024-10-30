import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SignUpDto } from './dto/sign-up';
import {
  SWAGGER_ERROR_RESPONSE_EXAMPLE,
  SWAGGER_SUCCESS_RESPONSE_EXAMPLE,
} from 'src/constant/swaager-example';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: '임시 회원가입용' })
  @ApiResponse(SWAGGER_SUCCESS_RESPONSE_EXAMPLE.signUp)
  @ApiResponse(SWAGGER_ERROR_RESPONSE_EXAMPLE.bad)
  @Post('/signUp')
  signUp(@Body() signUpDto: SignUpDto) {
    return this.authService.createUser(signUpDto);
  }

  @ApiResponse(SWAGGER_SUCCESS_RESPONSE_EXAMPLE.signUp)
  @ApiResponse(SWAGGER_ERROR_RESPONSE_EXAMPLE.bad)
  @ApiOperation({ summary: '카카오 로그인' })
  @Post('/kakao')
  async kakaoLogin(@Query('code') authCode: string) {
    console.log('code :', authCode);
    const kakaoRespone = await this.authService.getKakaoToken(authCode);

    const { access_token, refresh_token } = kakaoRespone;
    const userData = await this.authService.decodeKakaoToken(access_token);

    const user = await this.authService.getKakaoUser(userData.id);

    if (user) {
      return user;
    }
    console.log(userData);
    const newUser = await this.authService.createKakaoUser(userData);

    return {
      ...newUser,
      accessToken: access_token,
      refreshToken: refresh_token,
    };
  }
}
