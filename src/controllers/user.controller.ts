/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where,
  model,
  property,
} from '@loopback/repository';
import {
  post,
  param,
  get,
  getFilterSchemaFor,
  getModelSchemaRef,
  getWhereSchemaFor,
  patch,
  put,
  del,
  requestBody,
  HttpErrors,
} from '@loopback/rest';
import {User, UserTokens} from '../models';
import {
  UserRepository,
  Credentials,
  UserTokensRepository,
} from '../repositories';
import {
  PasswordHasherBindings,
  TokenServiceBindings,
  UserServiceBindings,
} from '../keys';
import {PasswordHasher} from '../services/hash.password.bcryptjs';
import {TokenService, authenticate} from '@loopback/authentication';
import {inject} from '@loopback/core';
import {
  CredentialsRequestBody,
  UserProfileSchema,
} from './specs/user-controller.specs';
import {pick} from 'lodash';
import {validateCredentials} from '../services/validator';
import {MyUserService} from '../services/user.service';
import {OPERATION_SECURITY_SPEC} from '../utils/security-spec';
import {SecurityBindings} from '@loopback/security';
import {ConfirmEmail} from '../auth/confirmEmail';
import {ForgotPassword} from '../auth/forgotPassword';
import {TIME_LIFE} from '../constants/userToken';
import moment from 'moment';
const rp = require('request-promise');
const Hashids = require('hashids/cjs');
const getRandomArbitrary = (min: number, max: number) => {
  return Math.round(Math.random() * (max - min) + min);
};

@model()
export class NewUserRequest extends User {
  @property({
    type: 'string',
    required: true,
  })
  password: string;
}

export class UserController {
  constructor(
    @repository(UserRepository)
    public userRepository: UserRepository,
    @repository(UserTokensRepository)
    public userTokensRepository: UserTokensRepository,
    @inject(PasswordHasherBindings.PASSWORD_HASHER)
    public passwordHasher: PasswordHasher,
    @inject(TokenServiceBindings.TOKEN_SERVICE)
    public jwtService: TokenService,
    @inject(UserServiceBindings.USER_SERVICE)
    public userService: MyUserService,
    @inject('authentication.confirm-email')
    protected confirmEmail: ConfirmEmail,
    @inject('authentication.forgot-password')
    protected forgotPassword: ForgotPassword,
  ) {}

  @post('/users', {
    responses: {
      '200': {
        description: 'User',
        content: {
          'application/json': {
            schema: {
              'x-ts-type': User,
            },
          },
        },
      },
    },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(NewUserRequest, {
            title: 'NewUser',
          }),
        },
      },
    })
    newUserRequest: NewUserRequest,
  ): Promise<User> {
    newUserRequest.roles = ['customer'];
    const picker = pick(newUserRequest, ['email', 'password']);
    await validateCredentials(false, picker, this.userRepository);
    const password = await this.passwordHasher.hashPassword(
      newUserRequest.password,
    );
    newUserRequest.password = password;
    try {
      const savedUser = await this.userRepository.create(newUserRequest);
      return savedUser;
    } catch (error) {
      if (error.code === 11000 && error.errmsg.includes('index: uniqueEmail')) {
        throw new HttpErrors.Conflict('Email value is already taken');
      } else {
        throw error;
      }
    }
  }

  @get('/users/count', {
    responses: {
      '200': {
        description: 'User model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async count(
    @param.query.object('where', getWhereSchemaFor(User)) where?: Where<User>,
  ): Promise<Count> {
    return this.userRepository.count(where);
  }

  @get('/users', {
    responses: {
      '200': {
        description: 'Array of User model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(User, {includeRelations: true}),
            },
          },
        },
      },
    },
  })
  async find(
    @param.query.object('filter', getFilterSchemaFor(User))
    filter?: Filter<User>,
  ): Promise<User[]> {
    console.log('try :');
    return this.userRepository.find(filter);
  }

  @patch('/users', {
    responses: {
      '200': {
        description: 'User PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(User, {partial: true}),
        },
      },
    })
    user: User,
    @param.query.object('where', getWhereSchemaFor(User)) where?: Where<User>,
  ): Promise<Count> {
    return this.userRepository.updateAll(user, where);
  }

  @get('/users/{id}', {
    responses: {
      '200': {
        description: 'User model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(User, {includeRelations: true}),
          },
        },
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.query.object('filter', getFilterSchemaFor(User))
    filter?: Filter<User>,
  ): Promise<User> {
    return this.userRepository.findById(id, filter);
  }

  @patch('/users/{id}', {
    responses: {
      '204': {
        description: 'User PATCH success',
      },
    },
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(User, {partial: true}),
        },
      },
    })
    user: User,
  ): Promise<void> {
    await this.userRepository.updateById(id, user);
  }

  @put('/users/{id}', {
    responses: {
      '204': {
        description: 'User PUT success',
      },
    },
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() user: User,
  ): Promise<void> {
    await this.userRepository.replaceById(id, user);
  }

  @del('/users/{id}', {
    responses: {
      '204': {
        description: 'User DELETE success',
      },
    },
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.userRepository.deleteById(id);
  }

  @get('/users/me', {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      '200': {
        description: 'The current user profile',
        content: {
          'application/json': {
            schema: UserProfileSchema,
          },
        },
      },
    },
  })
  @authenticate('jwt')
  async printCurrentUser(
    @inject(SecurityBindings.USER)
    currentUserProfile: User,
  ): Promise<User> {
    const userId = currentUserProfile.id;
    return this.userRepository.findById(userId);
  }

  @get('/users/verify-token/{token}', {
    responses: {
      '200': {
        description: 'User model instance',
        content: {'application/json': {schema: getModelSchemaRef(User)}},
      },
    },
  })
  async verifyToken(@param.path.string('token') token: string): Promise<User> {
    return this.confirmEmail.validateEmailForgot(token);
  }

  @post('/users/set-password', {
    responses: {
      '200': {
        description: 'Token',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                message: {
                  type: 'string',
                },
              },
            },
          },
        },
      },
    },
  })
  async setPassword(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(User, {partial: true}),
        },
      },
    })
    req: any,
  ): Promise<Object> {
    if (!req.id) {
      throw new HttpErrors.UnprocessableEntity('invalid user');
    }
    await this.confirmEmail.validateEmail(req.token);
    // eslint-disable-next-line require-atomic-updates
    const password = await this.passwordHasher.hashPassword(req.password);
    // const count = await this.userRepository.updateAll({password}, {
    //   id: req.id
    // });
    await this.userRepository.updateById(req.id, {password});
    return {message: 'Usuario actualizado correctamente'};
  }

  @post('/users/login', {
    responses: {
      '200': {
        description: 'Token',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                token: {
                  type: 'string',
                },
              },
            },
          },
        },
      },
    },
  })
  async login(
    @requestBody(CredentialsRequestBody) credentials: Credentials,
  ): Promise<{status: boolean}> {
    // ensure the user exists, and the password is correct
    const user = await this.userService.verifyCredentials(credentials);

    if (!user.verifiedEmail) {
      throw new HttpErrors.UnprocessableEntity('unverified email');
    }
    // convert a User object into a UserProfile object (reduced set of properties)
    const userProfile = this.userService.convertToUserProfile(user);

    // create a JSON Web Token based on the user profile
    // const token = await this.jwtService.generateToken(userProfile);
    const token = await generateTokenToPhone(
      userProfile,
      this.userTokensRepository,
    );
    const options: any = {
      method: 'POST',
      url: process.env.URL_SEND_WHATSAPP,
      headers: {'Content-Type': 'application/json'},
      body: {
        text:
          'Hola, su codigo de ingreso es: ' +
          token +
          ' El codigo tendra una duración de 5 minutos',
        phone: '573506208514',
      },
      json: true,
    };
    rp(options);
    return {status: true};
  }

  @post('/users/login/token', {
    responses: {
      '200': {
        description: 'Token',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                token: {
                  type: 'string',
                },
              },
            },
          },
        },
      },
    },
  })
  async loginByToken(
    @requestBody(CredentialsRequestBody) user: any,
  ): Promise<{token: string}> {
    // ensure the user exists, and the password is correct
    await verifyToken(user.token, this.userTokensRepository);
    const userAux = await this.userService.verifyCredentials(user);
    console.log('user', user);
    // convert a User object into a UserProfile object (reduced set of properties)
    const userProfile = this.userService.convertToUserProfile(userAux);

    // create a JSON Web Token based on the user profile
    const token = await this.jwtService.generateToken(userProfile);
    return {token};
  }
}

const generateTokenToPhone = async (
  user: User,
  userTokensRepository: UserTokensRepository,
) => {
  if (user === null) {
    throw new HttpErrors.NotFound('El correo electrónico no existe.');
  }

  const date = moment().add(TIME_LIFE, 'm');
  const hashids = new Hashids();
  const token = hashids.encode(
    getRandomArbitrary(0, 9),
    getRandomArbitrary(0, 9),
    getRandomArbitrary(0, 9),
  );

  console.log('token', token);

  const userTokenAux = new UserTokens({
    token,
    status: true,
    userId: user.id,
    expiredAt: date.format('YYYY-MM-DD hh:mm:ss'),
  });
  await userTokensRepository.create(userTokenAux);
  return token;
};

const verifyToken = async (
  token: string,
  userTokensRepository: UserTokensRepository,
): Promise<UserTokens> => {
  const userToken: UserTokens | null = await userTokensRepository.findOne({
    where: {token: {like: token}},
  });

  if (userToken == null) {
    throw new HttpErrors.NotFound('El token no existe.');
  }

  if (!userToken.status) {
    throw new HttpErrors.Conflict('El Token no esta activado.');
  }

  const expiredAt = moment(userToken.expiredAt);
  console.log('moment().diff(expiredAt)', moment().diff(expiredAt));

  if (moment().diff(expiredAt) >= 0) {
    throw new HttpErrors.Conflict('El Token expiro.');
  }
  return userToken;
};
