import { UrlToken } from './token';
import { UserRepository, UserTokensRepository } from '../repositories';
import { User, UserTokens } from '../models';
import moment from 'moment';
import { repository } from '@loopback/repository';

export class ConfirmEmail extends UrlToken {

  constructor(
    @repository(UserRepository)
    protected userRepository: UserRepository,
    @repository(UserTokensRepository)
    protected userTokensRepository: UserTokensRepository,
  ) {
    super(userRepository, userTokensRepository);
  }

  async validateEmail(token: string): Promise<User> {
    const userToken: UserTokens = await this.verifyToken(token);

    await this.userRepository.updateById(userToken.userId, new User({
      verifiedEmail: moment().format('YYYY-MM-DD hh:mm:ss')
    }));

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    this.suspendToken({
      token: { like: userToken.token },
    });

    return this.userRepository.findById(userToken.userId);
  }

  async validateEmailForgot(token: string): Promise<User> {
    const userToken: UserTokens = await this.verifyToken(token);

    await this.userRepository.updateById(userToken.userId, new User({
      verifiedEmail: moment().format('YYYY-MM-DD hh:mm:ss')
    }));

    return this.userRepository.findById(userToken.userId);
  }
}
