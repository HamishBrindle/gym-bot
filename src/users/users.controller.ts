import {
  Controller, UseGuards, Get, Query,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt.guard';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async find() {
    return this.usersService.find({
      relations: ['account'],
    });
  }

  @UseGuards(JwtAuthGuard)
  @Get(':email')
  async findOne(@Query('email') email: string) {
    return this.usersService.findOne({ email });
  }
}
