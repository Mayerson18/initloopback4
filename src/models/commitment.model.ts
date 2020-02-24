import {Entity, model, property, hasMany} from '@loopback/repository';
import {StatusCommitments} from './status-commitments.model';

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
    default: '',
  })
  description?: string;

  @property({
    type: 'string',
    default: '',
  })
  responsable?: string;

  @property({
    type: 'string',
    default: '',
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
    default: [],
  })
  attached: string[];

  @property({
    type: 'number',
    required: true,
  })
  meetingId?: number;

  @property({
    type: 'boolean',
    default: true,
  })
  active?: boolean;

  @hasMany(() => StatusCommitments)
  statusCommitments: StatusCommitments[];

  constructor(data?: Partial<Commitment>) {
    super(data);
  }
}

export interface CommitmentRelations {
  // describe navigational properties here
}

export type CommitmentWithRelations = Commitment & CommitmentRelations;
