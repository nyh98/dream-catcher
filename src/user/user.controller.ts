import {
  Body,
  Controller,
  FileTypeValidator,
  Get,
  ParseFilePipe,
  Patch,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import {
  ApiBody,
  ApiConsumes,
  ApiHeader,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/auth.guard';
import { GetUser } from 'src/custom/decorators/get-user.decorator';
import { User } from './entities/user.entity';
import { updateTemplateType, UpdateUserDto } from './dto/update-user.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { SWAGGER_SUCCESS_RESPONSE_EXAMPLE } from 'src/constant/swaager-example';

@ApiTags('users')
@ApiHeader({
  name: 'Authorization',
  required: true,
  description: 'Bearer 토큰 필요 ex) Bearer abca23zf',
})
@UseGuards(AuthGuard)
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ summary: '유저 정보 조회' })
  @ApiResponse(SWAGGER_SUCCESS_RESPONSE_EXAMPLE.userInfo)
  @Get()
  getMyProfile(@GetUser() user: User) {
    return this.userService.getProfile(user.id);
  }

  @ApiOperation({ summary: '프로필 변경' })
  @ApiResponse(SWAGGER_SUCCESS_RESPONSE_EXAMPLE.userInfo)
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: UpdateUserDto })
  @UseInterceptors(FileInterceptor('profileImage'))
  @Patch('/profile')
  async updateProfile(
    @Body('name') updateName: string,
    @UploadedFile(
      new ParseFilePipe({
        fileIsRequired: false,
        validators: [new FileTypeValidator({ fileType: /image/ })],
      }),
    )
    file: Express.Multer.File,
    @GetUser() user: User,
  ) {
    return this.userService.updateProfile(user, file, updateName);
  }

  @ApiOperation({ summary: '템플릿 타입 변경' })
  @ApiResponse(SWAGGER_SUCCESS_RESPONSE_EXAMPLE.userInfo)
  @Patch('/template')
  updateTemplateType(
    @Body() updateTemplateDto: updateTemplateType,
    @GetUser() user: User,
  ) {
    return this.userService.updateTemplate(user, updateTemplateDto.type);
  }
}
