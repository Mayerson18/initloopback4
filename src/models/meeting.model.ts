import {Entity, model, property, hasMany} from '@loopback/repository';
import {Commitment} from './commitment.model';
import {Attendees} from './attendees.model';

@model()
export class Meeting extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @property({
    type: 'string',
    default: '',
  })
  description?: string;

  @property({
    type: 'string',
    default: '',
  })
  place?: string;

  @property({
    type: 'string',
    default: '',
  })
  mainTopic?: string;

  @property({
    type: 'date',
    default: () => new Date(),
  })
  createdAt?: Date;

  @property({
    type: 'boolean',
    default: true,
  })
  active?: boolean;

  @property({
    type: 'number',
    required: true,
  })
  userId: number;

  @hasMany(() => Commitment)
  commitments: Commitment[];

  @hasMany(() => Attendees)
  attendees: Attendees[];

  constructor(data?: Partial<Meeting>) {
    super(data);
  }
}

export interface MeetingRelations {
  // describe navigational properties here
}

export type MeetingWithRelations = Meeting & MeetingRelations;
