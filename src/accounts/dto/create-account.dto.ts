import {
  IsString, MinLength,
} from 'class-validator';

export class CreateAccountDto {
  /**
   * Unique email address of User
   */
  @IsString()
  @MinLength(1)
  readonly username: string;

  /**
   * Raw password User has registered with
   */
  @IsString({ message: 'Invalid password type provided' })
  @MinLength(1)
  readonly password: string;
}
