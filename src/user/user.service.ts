import { Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { SignUpDto } from 'src/auth/dto/sign-up';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}
}
