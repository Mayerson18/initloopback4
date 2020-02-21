import { Entity, model, property } from '@loopback/repository';

@model()
export class Commitment extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @property({
    type: 'string',
    default: "",
  })
  description?: string;

  @property({
    type: 'string',
    default: "",
  })
  responsable?: string;

  @property({
    type: 'string',
    default: "",
  })
  observations?: string;

  @property({
    type: 'number',
    required: true,
    default: 1,
  })
  status: number;

  @property({
    type: 'date',
    default: () => new Date(),
  })
  createdAt?: Date;

  @property({
    type: 'array',
    itemType: 'string',
    required: true,
    default: [],
  })
  attached: string[];

  @property({
    type: 'number',
  })
  meetingId?: number;

  @property({
    type: 'boolean',
    default: true,
  })
  active?: boolean;

  constructor(data?: Partial<Commitment>) {
    super(data);
  }
}

export interface CommitmentRelations {
  // describe navigational properties here
}

export type CommitmentWithRelations = Commitment & CommitmentRelations;
