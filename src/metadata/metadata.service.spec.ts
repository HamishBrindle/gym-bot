import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { INestApplication } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { UsersModule } from 'src/users/users.module';
import { MetadataService } from './metadata.service';
import { MetadataModule } from './metadata.module';
import { MetadataEntity } from './metadata.entity';

let app: INestApplication;

describe('MetadataService', () => {
  let metadataService: MetadataService;
  let usersService: UsersService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'mysql',
          host: process.env.MYSQL_HOST,
          port: parseInt(process.env.MYSQL_INT_PORT as string, 10),
          username: process.env.MYSQL_ROOT_USER,
          password: process.env.MYSQL_ROOT_PASSWORD,
          database: process.env.MYSQL_DATABASE,
          entities: ['src/**/*.entity.ts'],
        }),
        MetadataModule,
        UsersModule,
      ],
    }).compile();

    app = module.createNestApplication();
    await app.init();

    metadataService = module.get<MetadataService>(MetadataService);
    usersService = module.get<UsersService>(UsersService);
  });

  afterAll(async () => {
    await app.close();
  });

  it('should be defined', () => {
    expect(metadataService).toBeDefined();
  });

  it.skip('should create metadata for user', async () => {
    const testUser = {
      email: 'hamishbrindle@gmail.com',
      firstName: 'Hamish',
      lastName: 'Brindle',
      password: 'aaa123',
    };
    const user = await usersService.create(testUser);
    expect(user).toBeDefined();
    expect(user).toBeTruthy();
    expect(user.email).toEqual(testUser.email);

    const testMetadata = {
      entity: 'user' as MetadataEntity,
      recordId: user.id,
      field: 'favourite-pie',
      value: 'Apple',
    };
    const metadata = await metadataService.create(testMetadata);
    expect(metadata).toBeDefined();
    expect(metadata).toBeTruthy();
    expect(metadata.entity).toEqual(testMetadata.entity);
    expect(metadata.recordId).toEqual(testMetadata.recordId);
    expect(metadata.field).toEqual(testMetadata.field);
    expect(metadata.value).toEqual(testMetadata.value);
  });

  // it('should find metadata for a user', async () => {
  //   const testUser = {
  //     email: 'hamishbrindle@gmail.com',
  //     firstName: 'Hamish',
  //     lastName: 'Brindle',
  //     password: 'aaa123',
  //   };
  //   const user = await usersService.create(testUser);
  //   expect(user).toBeDefined();
  //   expect(user).toBeTruthy();
  //   expect(user.email).toEqual(testUser.email);

  //   const testMetadata = {
  //     entity: 'user' as MetadataEntity,
  //     recordId: user.id,
  //     field: 'favourite-animal',
  //     value: 'Dog',
  //   };
  //   const metadata = await metadataService.create(testMetadata);
  //   expect(metadata).toBeDefined();
  //   expect(metadata).toBeTruthy();
  //   expect(metadata.entity).toEqual(testMetadata.entity);
  //   expect(metadata.recordId).toEqual(testMetadata.recordId);
  //   expect(metadata.field).toEqual(testMetadata.field);
  //   expect(metadata.value).toEqual(testMetadata.value);

  //   const foundMetaData = await metadataService.find({
  //     entity: testMetadata.entity,
  //     recordId: testMetadata.recordId,
  //   });

  //   expect(foundMetaData).toBeTruthy();
  //   expect(foundMetaData.length).toBeGreaterThan(0);
  // });
});
