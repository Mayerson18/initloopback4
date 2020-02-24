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
import {StatusCommitments} from '../models';
import {StatusCommitmentsRepository} from '../repositories';

export class StatusCommitmentsController {
  constructor(
    @repository(StatusCommitmentsRepository)
    public statusCommitmentsRepository : StatusCommitmentsRepository,
  ) {}

  @post('/status-commitments', {
    responses: {
      '200': {
        description: 'StatusCommitments model instance',
        content: {'application/json': {schema: getModelSchemaRef(StatusCommitments)}},
      },
    },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(StatusCommitments, {
            title: 'NewStatusCommitments',
            exclude: ['id'],
          }),
        },
      },
    })
    statusCommitments: Omit<StatusCommitments, 'id'>,
  ): Promise<StatusCommitments> {
    return this.statusCommitmentsRepository.create(statusCommitments);
  }

  @get('/status-commitments/count', {
    responses: {
      '200': {
        description: 'StatusCommitments model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async count(
    @param.query.object('where', getWhereSchemaFor(StatusCommitments)) where?: Where<StatusCommitments>,
  ): Promise<Count> {
    return this.statusCommitmentsRepository.count(where);
  }

  @get('/status-commitments', {
    responses: {
      '200': {
        description: 'Array of StatusCommitments model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(StatusCommitments, {includeRelations: true}),
            },
          },
        },
      },
    },
  })
  async find(
    @param.query.object('filter', getFilterSchemaFor(StatusCommitments)) filter?: Filter<StatusCommitments>,
  ): Promise<StatusCommitments[]> {
    return this.statusCommitmentsRepository.find(filter);
  }

  @patch('/status-commitments', {
    responses: {
      '200': {
        description: 'StatusCommitments PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(StatusCommitments, {partial: true}),
        },
      },
    })
    statusCommitments: StatusCommitments,
    @param.query.object('where', getWhereSchemaFor(StatusCommitments)) where?: Where<StatusCommitments>,
  ): Promise<Count> {
    return this.statusCommitmentsRepository.updateAll(statusCommitments, where);
  }

  @get('/status-commitments/{id}', {
    responses: {
      '200': {
        description: 'StatusCommitments model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(StatusCommitments, {includeRelations: true}),
          },
        },
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.query.object('filter', getFilterSchemaFor(StatusCommitments)) filter?: Filter<StatusCommitments>
  ): Promise<StatusCommitments> {
    return this.statusCommitmentsRepository.findById(id, filter);
  }

  @patch('/status-commitments/{id}', {
    responses: {
      '204': {
        description: 'StatusCommitments PATCH success',
      },
    },
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(StatusCommitments, {partial: true}),
        },
      },
    })
    statusCommitments: StatusCommitments,
  ): Promise<void> {
    await this.statusCommitmentsRepository.updateById(id, statusCommitments);
  }

  @put('/status-commitments/{id}', {
    responses: {
      '204': {
        description: 'StatusCommitments PUT success',
      },
    },
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() statusCommitments: StatusCommitments,
  ): Promise<void> {
    await this.statusCommitmentsRepository.replaceById(id, statusCommitments);
  }

  @del('/status-commitments/{id}', {
    responses: {
      '204': {
        description: 'StatusCommitments DELETE success',
      },
    },
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.statusCommitmentsRepository.deleteById(id);
  }
}
