import { Injectable } from '@nestjs/common';
import { UserRepository } from 'src/user/user.repository';
import { SignUpDto } from './dto/sign-up';

@Injectable()
export class AuthService {
  constructor(private readonly userRepository: UserRepository) {}

  createUser(signUpDto: SignUpDto) {
    return this.userRepository.insertUser(signUpDto);
  }
}
