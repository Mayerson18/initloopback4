import { Entity, model, property } from '@loopback/repository';

@model({settings: {strict: false}})
export class Attendees extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @property({
    type: 'string',
    required: true,
    default: "",
  })
  name: string;

  @property({
    type: 'string',
    required: true,
  })
  entity: string;

  @property({
    type: 'string',
    required: true,
    default: "",
  })
  email: string;

  @property({
    type: 'string',
    default: "",
  })
  phone?: string;

  @property({
    type: 'string',
    default: "",
  })
  contact?: string;

  @property({
    type: 'boolean',
    default: true,
  })
  active?: boolean;

  @property({
    type: 'date',
    default: () => new Date(),
  })
  createdAt?: Date;

  @property({
    type: 'number',
  })
  meetingId?: number;
  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<Attendees>) {
    super(data);
  }
}

export interface AttendeesRelations {
  // describe navigational properties here
}

export type AttendeesWithRelations = Attendees & AttendeesRelations;
