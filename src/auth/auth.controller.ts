import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  ApiBody,
  ApiHeader,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { SignUpDto } from './dto/sign-up';
import {
  SWAGGER_ERROR_RESPONSE_EXAMPLE,
  SWAGGER_SUCCESS_RESPONSE_EXAMPLE,
} from 'src/constant/swaager-example';
import { RefreshTokenDto } from './dto/token.dto';

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
    const kakaoRespone = await this.authService.getKakaoToken(authCode);

    const { access_token, refresh_token } = kakaoRespone;
    const userData = await this.authService.decodeKakaoToken(access_token);

    let user = await this.authService.getKakaoUser(userData.id.toString());

    if (!user) {
      user = await this.authService.createKakaoUser(userData);
    }

    return {
      ...user,
      accessToken: access_token,
      refreshToken: refresh_token,
    };
  }

  @ApiOperation({ summary: 'accessToken 갱신' })
  @ApiResponse(SWAGGER_SUCCESS_RESPONSE_EXAMPLE.refreshToken)
  @Post('/kakao/token')
  refreshKakaoToken(@Body() refreshTokenDto: RefreshTokenDto) {
    const { refreshToken } = refreshTokenDto;
    return this.authService.refreshKakaoToken(refreshToken);
  }
}
