import { Injectable } from '@nestjs/common';
import { Connection, Repository } from 'typeorm';
import { User } from 'src/users/users.entity';
import { ConfigService } from '@nestjs/config';
import { Crypto } from 'src/shared/Crypto';
import { InjectRepository } from '@nestjs/typeorm';
import { Account } from './accounts.entity';
import { CreateAccountDto } from './dto/create-account.dto';

@Injectable()
export class AccountsService {
  constructor(
    @InjectRepository(Account)
    private readonly accountsRepository: Repository<Account>,

    private readonly connection: Connection,
    private readonly configService: ConfigService,
  ) {}

  /**
   * Create a new Account and assign it to a User
   *
   * @param user
   * @param createAccountDto
   */
  async create(user: User, createAccountDto: CreateAccountDto): Promise<Account|null> {
    if (user.account) {
      throw Error('An Account already exists for this User');
    }

    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const account = new Account();

      // Encrypt (shittily) password and save to DB
      const cipheredPassword = this.cipher(
        this.configService.get<string>('SECRET') as string,
        user.id,
        createAccountDto.password,
      );
      account.username = createAccountDto.username;
      account.password = cipheredPassword;

      await queryRunner.manager.save(Account, account);

      user.account = account;
      await queryRunner.manager.save(User, user);

      await queryRunner.commitTransaction();

      return this.get(user);
    } catch (error) {
      console.error(error);
      await queryRunner.rollbackTransaction();
      return null;
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * Return a User's Gym-booking Account
   *
   * @param user
   */
  async get(user: User): Promise<Account|null> {
    const secret = this.configService.get<string>('SECRET') as string;
    const account = await this.accountsRepository.findOne({
      where: {
        user: {
          id: user.id,
        },
      },
      select: [
        'id',
        'username',
        'password',
      ],
    });
    if (!account) {
      return null;
    }
    account.password = this.decipher(secret, user.id, account.password);
    return account;
  }

  /**
   * Destroy the Account associated with a User
   *
   * @param user
   */
  async destroy(user: User): Promise<Account|null> {
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const account = await this.get(user);
      if (!account) {
        throw Error('Unable to delete User\'s account because it\'s null');
      }

      await queryRunner.manager.createQueryBuilder()
        .delete()
        .from(Account)
        .where('id = :id', { id: account.id })
        .execute();

      await queryRunner.commitTransaction();
      return account;
    } catch (error) {
      console.error(error);
      await queryRunner.rollbackTransaction();
      return null;
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * Cipher text using a provided key and optional algorithm
   *
   * @param key Secret string, probably from ENV
   * @param iv
   * @param text Text to be ciphered
   */
  cipher(key: string, iv: string, text: string): string {
    const crypto = new Crypto(key, iv);
    return crypto.encrypt(text);
  }

  /**
   * Decipher text using a provided key and optional algorithm
   *
   * @param key Secret string, probably from ENV
   * @param iv
   * @param cryptoData
   */
  decipher(key: string, iv: string, cryptoData: string) {
    const crypto = new Crypto(key, iv);
    return crypto.decrypt(cryptoData);
  }
}
