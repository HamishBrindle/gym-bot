import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { User } from 'src/users/users.entity';
import { AuthService } from './auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      usernameField: 'email',
      passwordField: 'password',
    });
  }

  /**
   * Validate a User based on provided email and password
   *
   * @param email
   * @param password
   * @throws {UnauthorizedException}
   * @returns Authenticated User
   */
  async validate(email: string, password: string): Promise<User> {
    const validUser = await this.authService.validateUser({ email, password });
    if (!validUser) {
      throw new UnauthorizedException();
    }
    return validUser;
  }
}
