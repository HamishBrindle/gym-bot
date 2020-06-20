import {
  IsEmail,
  IsString,
} from 'class-validator';

export class LoginUserDto {
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
