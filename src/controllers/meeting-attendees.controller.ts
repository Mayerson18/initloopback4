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
  Attendees,
} from '../models';
import { MeetingRepository } from '../repositories';

export class MeetingAttendeesController {
  constructor(
    @repository(MeetingRepository) protected meetingRepository: MeetingRepository,
  ) { }

  @get('/meetings/{id}/attendees', {
    responses: {
      '200': {
        description: 'Array of Meeting has many Attendees',
        content: {
          'application/json': {
            schema: { type: 'array', items: getModelSchemaRef(Attendees) },
          },
        },
      },
    },
  })
  async find(
    @param.path.number('id') id: number,
    @param.query.object('filter') filter?: Filter<Attendees>,
  ): Promise<Attendees[]> {
    return this.meetingRepository.attendees(id).find(filter);
  }

  @post('/meetings/{id}/attendees', {
    responses: {
      '200': {
        description: 'Meeting model instance',
        content: { 'application/json': { schema: getModelSchemaRef(Attendees) } },
      },
    },
  })
  async create(
    @param.path.number('id') id: typeof Meeting.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Attendees, {
            title: 'NewAttendeesInMeeting',
            exclude: ['id'],
            optional: ['meetingId']
          }),
        },
      },
    }) attendees: Omit<Attendees, 'id'>,
  ): Promise<Attendees> {
    return this.meetingRepository.attendees(id).create(attendees);
  }

  @patch('/meetings/{id}/attendees', {
    responses: {
      '200': {
        description: 'Meeting.Attendees PATCH success count',
        content: { 'application/json': { schema: CountSchema } },
      },
    },
  })
  async patch(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Attendees, { partial: true }),
        },
      },
    })
    attendees: Partial<Attendees>,
    @param.query.object('where', getWhereSchemaFor(Attendees)) where?: Where<Attendees>,
  ): Promise<Count> {
    return this.meetingRepository.attendees(id).patch(attendees, where);
  }

  @del('/meetings/{id}/attendees', {
    responses: {
      '200': {
        description: 'Meeting.Attendees DELETE success count',
        content: { 'application/json': { schema: CountSchema } },
      },
    },
  })
  async delete(
    @param.path.number('id') id: number,
    @param.query.object('where', getWhereSchemaFor(Attendees)) where?: Where<Attendees>,
  ): Promise<Count> {
    return this.meetingRepository.attendees(id).delete(where);
  }
}
