import { UserRepository, UserTokensRepository } from '../repositories';
import { UserTokens } from '../models';
import { HttpErrors } from '@loopback/rest/dist';
import { repository, Where } from '@loopback/repository';
import { UrlToken } from './token';

export class ForgotPassword extends UrlToken {

  constructor(
    @repository(UserRepository)
    protected userRepository: UserRepository,
    @repository(UserTokensRepository)
    protected userTokensRepository: UserTokensRepository,
  ) {
    super(userRepository, userTokensRepository);
  }

  async getTokens(): Promise<UserTokens> {
    if (this.user === null) {
      throw new HttpErrors.NotFound('El correo electrónico no existe.');
    }

    const where: Where<UserTokens> = {
      userId: { like: this.user.id },
      status: true,
    };

    const token: UserTokens | null = await this.userTokensRepository
      .findOne({ where: where });

    await this.suspendToken(where);
    console.log('generate1')
    if (token === null) {
      return this.generateToken();
    }

    await this.userTokensRepository
      .updateAll(new UserTokens({ status: false }), where);
    console.log('generate2')
    return this.generateToken();
  }
}
