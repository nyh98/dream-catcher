import { Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  getProfile(userId: number) {
    return this.userRepository.findOne({ where: { id: userId } });
  }
}
