import { ConflictException, Injectable } from '@nestjs/common';
import { UserRepository } from 'src/user/user.repository';
import { SignUpDto } from './dto/sign-up';

@Injectable()
export class AuthService {
  constructor(private readonly userRepository: UserRepository) {}

  async createUser(signUpDto: SignUpDto) {
    await this.userRepository.validateUserRegistration(signUpDto);
    return this.userRepository.insertUser(signUpDto);
  }
}
