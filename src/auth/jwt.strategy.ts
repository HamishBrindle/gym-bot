import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private userService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: true,
      secretOrKey: process.env.SECRET,
    });
  }

  /**
   * JWTStrategy validation.
   *
   * @override
   * @param payload
   */
  async validate(payload: any) {
    const { sub: id, email } = payload;
    const user = await this.userService.findOne({
      id,
      email,
    });
    if (!user) {
      throw Error('Unable to validate data within JWT 🙅‍♂️');
    }
    return { id, email };
  }
}
