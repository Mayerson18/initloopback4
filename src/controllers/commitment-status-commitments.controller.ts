import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where,
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  getWhereSchemaFor,
  param,
  patch,
  post,
  requestBody,
} from '@loopback/rest';
import {
  Commitment,
  StatusCommitments,
} from '../models';
import {CommitmentRepository} from '../repositories';

export class CommitmentStatusCommitmentsController {
  constructor(
    @repository(CommitmentRepository) protected commitmentRepository: CommitmentRepository,
  ) { }

  @get('/commitments/{id}/status-commitments', {
    responses: {
      '200': {
        description: 'Array of Commitment has many StatusCommitments',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(StatusCommitments)},
          },
        },
      },
    },
  })
  async find(
    @param.path.number('id') id: number,
    @param.query.object('filter') filter?: Filter<StatusCommitments>,
  ): Promise<StatusCommitments[]> {
    return this.commitmentRepository.statusCommitments(id).find(filter);
  }

  @post('/commitments/{id}/status-commitments', {
    responses: {
      '200': {
        description: 'Commitment model instance',
        content: {'application/json': {schema: getModelSchemaRef(StatusCommitments)}},
      },
    },
  })
  async create(
    @param.path.number('id') id: typeof Commitment.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(StatusCommitments, {
            title: 'NewStatusCommitmentsInCommitment',
            exclude: ['id'],
            optional: ['commitmentId']
          }),
        },
      },
    }) statusCommitments: Omit<StatusCommitments, 'id'>,
  ): Promise<StatusCommitments> {
    return this.commitmentRepository.statusCommitments(id).create(statusCommitments);
  }

  @patch('/commitments/{id}/status-commitments', {
    responses: {
      '200': {
        description: 'Commitment.StatusCommitments PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(StatusCommitments, {partial: true}),
        },
      },
    })
    statusCommitments: Partial<StatusCommitments>,
    @param.query.object('where', getWhereSchemaFor(StatusCommitments)) where?: Where<StatusCommitments>,
  ): Promise<Count> {
    return this.commitmentRepository.statusCommitments(id).patch(statusCommitments, where);
  }

  @del('/commitments/{id}/status-commitments', {
    responses: {
      '200': {
        description: 'Commitment.StatusCommitments DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.number('id') id: number,
    @param.query.object('where', getWhereSchemaFor(StatusCommitments)) where?: Where<StatusCommitments>,
  ): Promise<Count> {
    return this.commitmentRepository.statusCommitments(id).delete(where);
  }
}
