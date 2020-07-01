import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { Connection } from 'typeorm';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { BookingModule } from './booking/booking.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { JobsModule } from './jobs/jobs.module';
import { AccountsModule } from './accounts/accounts.module';
import { MetadataModule } from './metadata/metadata.module';

// @ts-ignore - Too lazy to declare
import ormconfig from '../ormconfig';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot(ormconfig),
    BookingModule,
    AuthModule,
    UsersModule,
    JobsModule,
    AccountsModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),
    MetadataModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {
  // @ts-ignore - Not unused, just injecting
  constructor(private connection: Connection) {}
}
