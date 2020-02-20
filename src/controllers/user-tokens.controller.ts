import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where,
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
} from '@loopback/rest';
import { UserTokens } from '../models/user-tokens.model';
import { UserTokensRepository } from '../repositories/user-tokens.repository';

export class UserTokensController {
  constructor(
    @repository(UserTokensRepository)
    public userTokensRepository: UserTokensRepository,
  ) { }

  @post('/user-tokens', {
    responses: {
      '200': {
        description: 'UserTokens model instance',
        content: { 'application/json': { schema: getModelSchemaRef(UserTokens) } },
      },
    },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(UserTokens, {
            title: 'NewUserTokens',
            exclude: ['id'],
          }),
        },
      },
    })
    userTokens: Omit<UserTokens, 'id'>,
  ): Promise<UserTokens> {
    return this.userTokensRepository.create(userTokens);
  }

  @get('/user-tokens/count', {
    responses: {
      '200': {
        description: 'UserTokens model count',
        content: { 'application/json': { schema: CountSchema } },
      },
    },
  })
  async count(
    @param.query.object('where', getWhereSchemaFor(UserTokens)) where?: Where<UserTokens>,
  ): Promise<Count> {
    return this.userTokensRepository.count(where);
  }

  @get('/user-tokens', {
    responses: {
      '200': {
        description: 'Array of UserTokens model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(UserTokens, { includeRelations: true }),
            },
          },
        },
      },
    },
  })
  async find(
    @param.query.object('filter', getFilterSchemaFor(UserTokens)) filter?: Filter<UserTokens>,
  ): Promise<UserTokens[]> {
    return this.userTokensRepository.find(filter);
  }

  @patch('/user-tokens', {
    responses: {
      '200': {
        description: 'UserTokens PATCH success count',
        content: { 'application/json': { schema: CountSchema } },
      },
    },
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(UserTokens, { partial: true }),
        },
      },
    })
    userTokens: UserTokens,
    @param.query.object('where', getWhereSchemaFor(UserTokens)) where?: Where<UserTokens>,
  ): Promise<Count> {
    return this.userTokensRepository.updateAll(userTokens, where);
  }

  @get('/user-tokens/{id}', {
    responses: {
      '200': {
        description: 'UserTokens model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(UserTokens, { includeRelations: true }),
          },
        },
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.query.object('filter', getFilterSchemaFor(UserTokens)) filter?: Filter<UserTokens>
  ): Promise<UserTokens> {
    return this.userTokensRepository.findById(id, filter);
  }

  @patch('/user-tokens/{id}', {
    responses: {
      '204': {
        description: 'UserTokens PATCH success',
      },
    },
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(UserTokens, { partial: true }),
        },
      },
    })
    userTokens: UserTokens,
  ): Promise<void> {
    await this.userTokensRepository.updateById(id, userTokens);
  }

  @put('/user-tokens/{id}', {
    responses: {
      '204': {
        description: 'UserTokens PUT success',
      },
    },
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() userTokens: UserTokens,
  ): Promise<void> {
    await this.userTokensRepository.replaceById(id, userTokens);
  }

  @del('/user-tokens/{id}', {
    responses: {
      '204': {
        description: 'UserTokens DELETE success',
      },
    },
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.userTokensRepository.deleteById(id);
  }
}
