import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindManyOptions, FindOneOptions } from 'typeorm';
import bcrypt from 'bcryptjs';
import { ConfigService } from '@nestjs/config';
import { LoggerService } from 'src/logger/logger.service';
import { User } from './users.entity';
import { CreateUserDto } from './dto/create-user.dto';

interface IFindArguments {
  id?: string | number;
  email?: string;
}

@Injectable()
export class UsersService implements OnModuleInit {
  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
    private configService: ConfigService,
    private logger: LoggerService,
  ) {
    this.logger.setContext('UserService');
  }

  async onModuleInit(): Promise<void> {
    await this.initAdmin();
  }

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

  /**
   * Check for - and create if not found - an Admin user for
   * our system.
   *
   * NOTE: Obviously, I should be seeding - but I'm using Fargate right
   *       now and there isn't really a way for me to access it's
   *       container to do that, so this is my workaround.
   *
   */
  private async initAdmin(): Promise<boolean> {
    this.logger.log('Attempting to initialize an Admin user...');

    const email = this.configService.get<string>('ADMIN_EMAIL');
    const password = this.configService.get<string>('ADMIN_PASSWORD');

    if (!email || !password) {
      this.logger.error('Unable to retrieve environment variables for Admin user!');
      return false;
    }

    const admin = await this.findOne({ email });

    if (admin) {
      this.logger.log('Admin user already exists in the system - we\'re good to go!');
      return true;
    }

    const newAdmin = await this.create({
      email,
      password,
      firstName: 'Hamish',
      lastName: 'Brindle',
    });

    if (!newAdmin) {
      this.logger.error('Something went wrong with Admin user setup... Fuck.');
      return false;
    }

    this.logger.log('Admin user created successfully!');

    return true;
  }
}
