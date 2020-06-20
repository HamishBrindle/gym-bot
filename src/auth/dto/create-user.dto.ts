import {
  IsEmail, IsString, MinLength, MaxLength,
} from 'class-validator';

export class CreateUserDto {
  /**
   * First name of User
   */
  @MinLength(1)
  @MaxLength(100)
  readonly firstName: string;

  /**
   * Last name of User
   */
  @MinLength(1)
  @MaxLength(100)
  readonly lastName: string;

  /**
   * Unique email address of User
   */
  @IsEmail()
  readonly email: string;

  /**
   * Raw password User has registered with
   */
  @IsString({ message: 'Invalid password type provided' })
  readonly password: string;
}
