import { Controller, Get, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { ApiHeader, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/auth.guard';
import { GetUser } from 'src/custom/decorators/get-user.decorator';
import { User } from './entities/user.entity';

@ApiTags('users')
@ApiHeader({
  name: 'Authorization',
  required: true,
  description:
    'Bearer 토큰 필요 ex) Bearer abca23zf 임시로 Bearer userId로 주세용',
})
@UseGuards(AuthGuard)
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ summary: '유저 정보 조회' })
  @Get()
  getMyProfile(@GetUser() user: User) {
    return this.userService.getProfile(user.id);
  }
}
