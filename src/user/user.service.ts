import { Injectable } from '@nestjs/common';
import { UsersRepository } from './user.repository';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(private readonly userRepository: UsersRepository) {}

  async create(email: string, password: string): Promise<User> {
    const user = new User({
      email,
      password,
    });
    return this.userRepository.create(user);
  }

  findOne(id: number) {
    if (!id) {
      return null;
    }
    return this.userRepository.findOne({ id });
  }

  find(email: string) {
    return this.userRepository.find({ email });
  }
}
