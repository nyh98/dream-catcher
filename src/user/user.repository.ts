import { ConflictException, Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { SignUpDto } from 'src/auth/dto/sign-up';

@Injectable()
export class UserRepository extends Repository<User> {
  constructor(private dataSource: DataSource) {
    super(User, dataSource.createEntityManager());
  }

  insertUser(signUpDto: SignUpDto) {
    const newUser = this.create(signUpDto);
    return this.save(newUser);
  }

  async validateUserRegistration(signUpDto: SignUpDto) {
    const user = await this.findOne({
      where: { uid: signUpDto.uid, provider: signUpDto.provider },
    });

    if (user) {
      throw new ConflictException('이미 가입된 유저 입니다');
    }
  }
}
