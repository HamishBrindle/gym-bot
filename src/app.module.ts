import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { BookingModule } from './booking/booking.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';

// @ts-ignore - Too lazy to declare
import ormconfig from '../ormconfig';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot(ormconfig),
    BookingModule,
    AuthModule,
    UsersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
