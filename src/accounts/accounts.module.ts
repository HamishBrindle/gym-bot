import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from 'src/users/users.module';
import { AccountsService } from './accounts.service';
import { AccountsController } from './accounts.controller';
import { Account } from './accounts.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Account]), ConfigModule, UsersModule],
  providers: [AccountsService],
  controllers: [AccountsController],
  exports: [AccountsService],
})
export class AccountsModule {}
