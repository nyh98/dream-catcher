import { Body, Controller, Post } from '@nestjs/common';
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

  @ApiOperation({ summary: '회원가입' })
  @ApiResponse(SWAGGER_SUCCESS_RESPONSE_EXAMPLE.signUp)
  @ApiResponse(SWAGGER_ERROR_RESPONSE_EXAMPLE.bad)
  @Post('/signUp')
  signUp(@Body() signUpDto: SignUpDto) {
    return this.authService.createUser(signUpDto);
  }
}
