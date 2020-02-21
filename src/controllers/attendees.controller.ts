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
import {Attendees} from '../models';
import {AttendeesRepository} from '../repositories';

export class AttendeesController {
  constructor(
    @repository(AttendeesRepository)
    public attendeesRepository : AttendeesRepository,
  ) {}

  @post('/attendees', {
    responses: {
      '200': {
        description: 'Attendees model instance',
        content: {'application/json': {schema: getModelSchemaRef(Attendees)}},
      },
    },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Attendees, {
            title: 'NewAttendees',
            exclude: ['id'],
          }),
        },
      },
    })
    attendees: Omit<Attendees, 'id'>,
  ): Promise<Attendees> {
    return this.attendeesRepository.create(attendees);
  }

  @get('/attendees/count', {
    responses: {
      '200': {
        description: 'Attendees model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async count(
    @param.query.object('where', getWhereSchemaFor(Attendees)) where?: Where<Attendees>,
  ): Promise<Count> {
    return this.attendeesRepository.count(where);
  }

  @get('/attendees', {
    responses: {
      '200': {
        description: 'Array of Attendees model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(Attendees, {includeRelations: true}),
            },
          },
        },
      },
    },
  })
  async find(
    @param.query.object('filter', getFilterSchemaFor(Attendees)) filter?: Filter<Attendees>,
  ): Promise<Attendees[]> {
    return this.attendeesRepository.find(filter);
  }

  @patch('/attendees', {
    responses: {
      '200': {
        description: 'Attendees PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Attendees, {partial: true}),
        },
      },
    })
    attendees: Attendees,
    @param.query.object('where', getWhereSchemaFor(Attendees)) where?: Where<Attendees>,
  ): Promise<Count> {
    return this.attendeesRepository.updateAll(attendees, where);
  }

  @get('/attendees/{id}', {
    responses: {
      '200': {
        description: 'Attendees model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Attendees, {includeRelations: true}),
          },
        },
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.query.object('filter', getFilterSchemaFor(Attendees)) filter?: Filter<Attendees>
  ): Promise<Attendees> {
    return this.attendeesRepository.findById(id, filter);
  }

  @patch('/attendees/{id}', {
    responses: {
      '204': {
        description: 'Attendees PATCH success',
      },
    },
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Attendees, {partial: true}),
        },
      },
    })
    attendees: Attendees,
  ): Promise<void> {
    await this.attendeesRepository.updateById(id, attendees);
  }

  @put('/attendees/{id}', {
    responses: {
      '204': {
        description: 'Attendees PUT success',
      },
    },
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() attendees: Attendees,
  ): Promise<void> {
    await this.attendeesRepository.replaceById(id, attendees);
  }

  @del('/attendees/{id}', {
    responses: {
      '204': {
        description: 'Attendees DELETE success',
      },
    },
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.attendeesRepository.deleteById(id);
  }
}
