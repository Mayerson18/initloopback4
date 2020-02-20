import { UserRepository, UserTokensRepository } from '../repositories';
import { User, UserTokens } from '../models';
import { HttpErrors } from '@loopback/rest/dist';
import moment from 'moment';
import md5 from 'md5';
import { Where } from '@loopback/repository';
import { TIME_LIFE } from '../constants/userToken';

export class UrlToken {

  protected user: User | null;

  constructor(
    protected userRepository: UserRepository,
    protected userTokensRepository: UserTokensRepository,
  ) {
  }

  async generateToken(): Promise<UserTokens> {
    if (this.user === null) {
      throw new HttpErrors.NotFound('El correo electrónico no existe.');
    }

    const date = moment().add(TIME_LIFE, 'm');

    return this.userTokensRepository.create(new UserTokens({
      token: md5(date.format('x')),
      status: true,
      userId: this.user.id,
      expiredAt: date.format('YYYY-MM-DD hh:mm:ss'),
    }));
  }

  protected async suspendToken(where: Where<UserTokens>) {
    await this.userTokensRepository
      .updateAll(new UserTokens({ status: false }), where);
  }

  async getUserByEmail(email: string): Promise<User> {
    this.user = await this.userRepository
      .findOne({ where: { email: email } });

    if (this.user === null) {
      throw new HttpErrors.NotFound('El correo electrónico no existe.');
    }

    return this.user;
  }

  async verifyToken(token: string): Promise<UserTokens> {
    const userToken: UserTokens | null = await this.userTokensRepository
      .findOne({ where: { token: { like: token } } });

    if (userToken == null) {
      throw new HttpErrors.NotFound('El token no existe.');
    }

    if (!userToken.status) {
      throw new HttpErrors.Conflict('El Token no esta activado.');
    }

    const expiredAt = moment(userToken.expiredAt);

    if (moment().diff(expiredAt) <= 0) {
      if (!userToken.status) {
        throw new HttpErrors.Conflict('El Token esta expirado.');
      }
    }

    return userToken;
  }
}
