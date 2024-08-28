/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    return await this.userRepository.save(createUserDto);
  }

  async findAll(): Promise<User[]> {
    return await this.userRepository.find();
  }

  async findOne(uuid: string): Promise<Omit<User, 'password'> | null> {
    const user = await this.userRepository.findOne({
      where: { uuid },
    });

    if (user) {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    }

    return null;
  }

  async findOneById(uuid: string): Promise<User> {
    return await this.userRepository.findOne({
      where: { uuid },
    });
  }

  async findOneByEmail(email: string): Promise<User> {
    return await this.userRepository.findOne({ where: { email } });
  }

  async update(uuid: string, updateUserDto: UpdateUserDto) {
    const { name, email } = updateUserDto;
    const user = await this.findOne(uuid);
    user.name = name ? name : user.name;
    user.email = email ? email : user.email;

    return await this.userRepository.save(user);
  }

  async remove(uuid: string): Promise<string> {
    const deleteUser = await this.userRepository.delete(uuid);
    return deleteUser.affected > 0
      ? 'User Removed Successfully!'
      : 'Error removing User';
  }
}
