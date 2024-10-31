import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { templateTpyes, TemplateType } from 'src/types/types';

export class UpdateUserDto {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ type: 'file', required: false })
  @IsNotEmpty()
  @IsOptional()
  profileImage?: any;
}

export class updateTemplateType {
  @ApiProperty()
  @IsString()
  @IsIn(templateTpyes, { message: '유효하지 않은 템플릿 형식' })
  type: TemplateType;
}
