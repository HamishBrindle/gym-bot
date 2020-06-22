import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcryptjs';
import { User } from 'src/users/users.entity';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UsersService } from '../users/users.service';
import { LoginUserDto } from './dto/login-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  /**
   * Validate an existing User with provided email and password.
   *
   * @param loginInput
   * @returns Found User record
   */
  async validateUser(loginInput: LoginUserDto): Promise<User | null> {
    const { email, password } = loginInput;

    const foundUser = await this.usersService.findOne({
      email,
    }, {
      select: [
        'id',
        'firstName',
        'lastName',
        'email',
        'password',
        'createdAt',
        'updatedAt',
      ],
    });

    if (!foundUser) return null;

    const valid = await bcrypt.compare(password, foundUser.password);
    if (!valid) return null;

    return foundUser;
  }

  /**
   * Login an existing User and return a JWT
   *
   * @param user User record
   */
  async login(user: any) {
    const payload = {
      ...user,
      password: undefined,
      sub: user.id,
    };
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }

  /**
   * Register a new User with the site and return a JWT
   *
   * @param createUserDto
   */
  async register(createUserDto: CreateUserDto) {
    const user = await this.usersService.create(createUserDto);
    const payload = {
      ...user,
      password: undefined,
      sub: user.id,
    };
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }
}
