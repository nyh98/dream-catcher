import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SignUpDto } from './dto/sign-up';
import { UserService } from 'src/user/user.service';
import {
  SWAGGER_ERROR_RESPONSE_EXAMPLES,
  SWAGGER_SUCCESS_RESPONSE_EXAMPLE,
} from 'src/constant';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @ApiOperation({ summary: '회원가입' })
  @ApiResponse(SWAGGER_SUCCESS_RESPONSE_EXAMPLE.signUp)
  @ApiResponse(SWAGGER_ERROR_RESPONSE_EXAMPLES.bad)
  @Post('/signUp')
  signUp(@Body() signUpDto: SignUpDto) {
    return this.userService.createUser(signUpDto);
  }
}
