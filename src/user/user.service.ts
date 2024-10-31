import { Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { TemplateType } from 'src/types/types';
import { User } from './entities/user.entity';
import { AwsService } from 'src/aws/aws.service';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly awsService: AwsService,
  ) {}

  getProfile(userId: number) {
    return this.userRepository.findOne({ where: { id: userId } });
  }

  updateTemplate(user: User, type: TemplateType) {
    const updateUser = this.userRepository.create({
      ...user,
      templateType: type,
    });
    return this.userRepository.save(updateUser);
  }

  async updateProfile(user: User, file?: Express.Multer.File, name?: string) {
    const updateField: User = { ...user };

    if (file) {
      await this.awsService.deleteImageToS3(user.profileImg); //기존 이미지 삭제
      updateField.profileImg = await this.awsService.imageUploadToS3(file);
    }

    if (name) {
      updateField.name = name;
    }
    const updateUser = this.userRepository.create(updateField);

    return this.userRepository.save(updateUser);
  }
}
