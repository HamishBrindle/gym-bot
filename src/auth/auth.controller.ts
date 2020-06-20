import {
  Controller, Request, Post, UseGuards, Get, Body,
} from '@nestjs/common';
import { Request as IRequest } from 'express';
import { LocalAuthGuard } from 'src/auth/local.guard';
import { AuthService } from 'src/auth/auth.service';
import { JwtAuthGuard } from 'src/auth/jwt.guard';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/users/users.entity';
import { CreateUserDto } from 'src/users/dto/create-user.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UsersService,
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req: IRequest) {
    return this.authService.login(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Post('register')
  async register(@Body() user: CreateUserDto) {
    return this.authService.register(user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async me(@Request() req: IRequest) {
    const { id } = (req.user as User);
    const user = await this.userService.findOne({ id }) as any;
    if (user) {
      user.password = undefined;
      return user;
    }
    return null;
  }
}
