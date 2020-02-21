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
import {Commitment} from '../models';
import {CommitmentRepository} from '../repositories';

export class CommitmentController {
  constructor(
    @repository(CommitmentRepository)
    public commitmentRepository : CommitmentRepository,
  ) {}

  @post('/commitments', {
    responses: {
      '200': {
        description: 'Commitment model instance',
        content: {'application/json': {schema: getModelSchemaRef(Commitment)}},
      },
    },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Commitment, {
            title: 'NewCommitment',
            exclude: ['id'],
          }),
        },
      },
    })
    commitment: Omit<Commitment, 'id'>,
  ): Promise<Commitment> {
    return this.commitmentRepository.create(commitment);
  }

  @get('/commitments/count', {
    responses: {
      '200': {
        description: 'Commitment model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async count(
    @param.query.object('where', getWhereSchemaFor(Commitment)) where?: Where<Commitment>,
  ): Promise<Count> {
    return this.commitmentRepository.count(where);
  }

  @get('/commitments', {
    responses: {
      '200': {
        description: 'Array of Commitment model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(Commitment, {includeRelations: true}),
            },
          },
        },
      },
    },
  })
  async find(
    @param.query.object('filter', getFilterSchemaFor(Commitment)) filter?: Filter<Commitment>,
  ): Promise<Commitment[]> {
    return this.commitmentRepository.find(filter);
  }

  @patch('/commitments', {
    responses: {
      '200': {
        description: 'Commitment PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Commitment, {partial: true}),
        },
      },
    })
    commitment: Commitment,
    @param.query.object('where', getWhereSchemaFor(Commitment)) where?: Where<Commitment>,
  ): Promise<Count> {
    return this.commitmentRepository.updateAll(commitment, where);
  }

  @get('/commitments/{id}', {
    responses: {
      '200': {
        description: 'Commitment model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Commitment, {includeRelations: true}),
          },
        },
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.query.object('filter', getFilterSchemaFor(Commitment)) filter?: Filter<Commitment>
  ): Promise<Commitment> {
    return this.commitmentRepository.findById(id, filter);
  }

  @patch('/commitments/{id}', {
    responses: {
      '204': {
        description: 'Commitment PATCH success',
      },
    },
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Commitment, {partial: true}),
        },
      },
    })
    commitment: Commitment,
  ): Promise<void> {
    await this.commitmentRepository.updateById(id, commitment);
  }

  @put('/commitments/{id}', {
    responses: {
      '204': {
        description: 'Commitment PUT success',
      },
    },
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() commitment: Commitment,
  ): Promise<void> {
    await this.commitmentRepository.replaceById(id, commitment);
  }

  @del('/commitments/{id}', {
    responses: {
      '204': {
        description: 'Commitment DELETE success',
      },
    },
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.commitmentRepository.deleteById(id);
  }
}
