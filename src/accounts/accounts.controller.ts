import {
  Controller, UseGuards, Post, Body, Delete, Get,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt.guard';
import { CurrentUser } from 'src/shared/decorators/user-info.decorator';
import { User } from 'src/users/users.entity';
import { AccountsService } from './accounts.service';
import { CreateAccountDto } from './dto/create-account.dto';

@Controller('accounts')
export class AccountsController {
  constructor(
    private readonly accountsService: AccountsService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@CurrentUser() currentUser: User, @Body() createAccountDto: CreateAccountDto) {
    return this.accountsService.create(currentUser, createAccountDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async findOne(@CurrentUser() currentUser: User) {
    return this.accountsService.get(currentUser);
  }

  @UseGuards(JwtAuthGuard)
  @Delete()
  async destroy(@CurrentUser() currentUser: User) {
    return this.accountsService.destroy(currentUser);
  }
}
