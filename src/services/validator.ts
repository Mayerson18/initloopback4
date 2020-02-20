import * as isemail from 'isemail';
import { HttpErrors } from '@loopback/rest';
import { Credentials, UserRepository } from '../repositories/user.repository';

export async function validateCredentials(isLogin: boolean, credentials: Credentials, user: UserRepository) {
  // Validate Email
  const foundUser = await user.findOne({
    where: {
      email: credentials.email
    }
  });

  if (!isLogin && foundUser) {
    throw new HttpErrors.UnprocessableEntity('EMAIL_ALREADY_EXIST');
  }

  if (!isemail.validate(credentials.email)) {
    throw new HttpErrors.UnprocessableEntity('invalid email');
  }

  // Validate Password Length
  if (credentials.password.length < 8) {
    throw new HttpErrors.UnprocessableEntity(
      'password must be minimum 8 characters',
    );
  }
}
