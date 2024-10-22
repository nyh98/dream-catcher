import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { SignUpDto } from 'src/auth/dto/sign-up';

@Injectable()
export class UserRepository extends Repository<User> {
  constructor(private dataSource: DataSource) {
    super(User, dataSource.createEntityManager());
  }

  createUser(signUpDto: SignUpDto) {
    const newUser = this.create(signUpDto);
    return this.save(newUser);
  }
}
