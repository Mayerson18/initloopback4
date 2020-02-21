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
import {Meeting} from '../models';
import {MeetingRepository} from '../repositories';

export class MeetingController {
  constructor(
    @repository(MeetingRepository)
    public meetingRepository : MeetingRepository,
  ) {}

  @post('/meetings', {
    responses: {
      '200': {
        description: 'Meeting model instance',
        content: {'application/json': {schema: getModelSchemaRef(Meeting)}},
      },
    },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Meeting, {
            title: 'NewMeeting',
            exclude: ['id'],
          }),
        },
      },
    })
    meeting: Omit<Meeting, 'id'>,
  ): Promise<Meeting> {
    return this.meetingRepository.create(meeting);
  }

  @get('/meetings/count', {
    responses: {
      '200': {
        description: 'Meeting model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async count(
    @param.query.object('where', getWhereSchemaFor(Meeting)) where?: Where<Meeting>,
  ): Promise<Count> {
    return this.meetingRepository.count(where);
  }

  @get('/meetings', {
    responses: {
      '200': {
        description: 'Array of Meeting model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(Meeting, {includeRelations: true}),
            },
          },
        },
      },
    },
  })
  async find(
    @param.query.object('filter', getFilterSchemaFor(Meeting)) filter?: Filter<Meeting>,
  ): Promise<Meeting[]> {
    return this.meetingRepository.find(filter);
  }

  @patch('/meetings', {
    responses: {
      '200': {
        description: 'Meeting PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Meeting, {partial: true}),
        },
      },
    })
    meeting: Meeting,
    @param.query.object('where', getWhereSchemaFor(Meeting)) where?: Where<Meeting>,
  ): Promise<Count> {
    return this.meetingRepository.updateAll(meeting, where);
  }

  @get('/meetings/{id}', {
    responses: {
      '200': {
        description: 'Meeting model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Meeting, {includeRelations: true}),
          },
        },
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.query.object('filter', getFilterSchemaFor(Meeting)) filter?: Filter<Meeting>
  ): Promise<Meeting> {
    return this.meetingRepository.findById(id, filter);
  }

  @patch('/meetings/{id}', {
    responses: {
      '204': {
        description: 'Meeting PATCH success',
      },
    },
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Meeting, {partial: true}),
        },
      },
    })
    meeting: Meeting,
  ): Promise<void> {
    await this.meetingRepository.updateById(id, meeting);
  }

  @put('/meetings/{id}', {
    responses: {
      '204': {
        description: 'Meeting PUT success',
      },
    },
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() meeting: Meeting,
  ): Promise<void> {
    await this.meetingRepository.replaceById(id, meeting);
  }

  @del('/meetings/{id}', {
    responses: {
      '204': {
        description: 'Meeting DELETE success',
      },
    },
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.meetingRepository.deleteById(id);
  }
}
