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

  //임시 인증 함수
  validKakaoToken(token: number) {
    //임시로 id값만 받음
    //나중에 토큰 검증 로직 구현할것
    return this.userRepository.findOne({ where: { id: token } });
  }
}
