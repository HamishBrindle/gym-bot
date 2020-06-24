import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindManyOptions, FindOneOptions } from 'typeorm';
import bcrypt from 'bcryptjs';
import { User } from 'src/users/users.entity';
import { CreateUserDto } from './dto/create-user.dto';

interface IFindArguments {
  id?: string | number;
  email?: string;
}

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  /**
   * Create a User record, and if provided, associate it with new
   * or existing Role record(s)
   *
   * @param createUserDto
   */
  async create(createUserDto: CreateUserDto): Promise<User> {
    const password = await bcrypt.hash(createUserDto.password, 12);
    return this.usersRepository.create({
      ...createUserDto,
      password,
    }).save();
  }

  /**
   * Fetch a list of Users
   *
   * @param options
   */
  async find(options?: FindManyOptions): Promise<User[]> {
    return this.usersRepository.find(options);
  }

  /**
   * Fetch a single User
   *
   * @param args
   * @param options
   */
  async findOne(args: IFindArguments, options: FindOneOptions = {}): Promise<User | null> {
    const foundUser = await this.usersRepository.findOne({
      ...options,
      where: {
        ...args,
      },
    } as FindOneOptions);

    if (!foundUser) {
      return null;
    }

    return foundUser;
  }

  /**
   * Delete a User from the database
   *
   * @param id
   */
  async destroy(id: string): Promise<void> {
    await this.usersRepository.delete(id);
  }
}
