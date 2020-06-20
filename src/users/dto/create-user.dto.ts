import {
  IsEmail,
  IsString,
  MinLength,
  MaxLength,
} from 'class-validator';

export class CreateUserDto {
  /**
   * First name of User
   */
  @IsString()
  @MinLength(1)
  @MaxLength(25)
  readonly firstName: string;

  /**
   * Last name of User
   */
  @IsString()
  @MinLength(1)
  @MaxLength(25)
  readonly lastName: string;

  /**
   * Unique email address of User
   */
  @IsString()
  @IsEmail()
  readonly email: string;

  /**
   * Raw password User has registered with
   */
  @IsString({ message: 'Invalid password type provided' })
  @MinLength(6, { message: 'Password must be at least 6 character long' })
  readonly password: string;
}
