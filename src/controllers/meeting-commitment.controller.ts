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
  Meeting,
  Commitment,
} from '../models';
import { MeetingRepository } from '../repositories/meeting.repository';

export class MeetingCommitmentController {
  constructor(
    @repository(MeetingRepository) protected meetingRepository: MeetingRepository,
  ) { }

  @get('/meetings/{id}/commitments', {
    responses: {
      '200': {
        description: 'Array of Meeting has many Commitment',
        content: {
          'application/json': {
            schema: { type: 'array', items: getModelSchemaRef(Commitment) },
          },
        },
      },
    },
  })
  async find(
    @param.path.number('id') id: number,
    @param.query.object('filter') filter?: Filter<Commitment>,
  ): Promise<Commitment[]> {
    return this.meetingRepository.commitments(id).find(filter);
  }

  @post('/meetings/{id}/commitments', {
    responses: {
      '200': {
        description: 'Meeting model instance',
        content: { 'application/json': { schema: getModelSchemaRef(Commitment) } },
      },
    },
  })
  async create(
    @param.path.number('id') id: typeof Meeting.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Commitment, {
            title: 'NewCommitmentInMeeting',
            exclude: ['id'],
            optional: ['meetingId']
          }),
        },
      },
    }) commitment: Omit<Commitment, 'id'>,
  ): Promise<Commitment> {
    return this.meetingRepository.commitments(id).create(commitment);
  }

  @patch('/meetings/{id}/commitments', {
    responses: {
      '200': {
        description: 'Meeting.Commitment PATCH success count',
        content: { 'application/json': { schema: CountSchema } },
      },
    },
  })
  async patch(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Commitment, { partial: true }),
        },
      },
    })
    commitment: Partial<Commitment>,
    @param.query.object('where', getWhereSchemaFor(Commitment)) where?: Where<Commitment>,
  ): Promise<Count> {
    return this.meetingRepository.commitments(id).patch(commitment, where);
  }

  @del('/meetings/{id}/commitments', {
    responses: {
      '200': {
        description: 'Meeting.Commitment DELETE success count',
        content: { 'application/json': { schema: CountSchema } },
      },
    },
  })
  async delete(
    @param.path.number('id') id: number,
    @param.query.object('where', getWhereSchemaFor(Commitment)) where?: Where<Commitment>,
  ): Promise<Count> {
    return this.meetingRepository.commitments(id).delete(where);
  }
}
