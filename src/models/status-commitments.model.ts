import {Entity, model, property} from '@loopback/repository';

@model()
export class StatusCommitments extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @property({
    type: 'number',
    required: true,
  })
  value: number;

  @property({
    type: 'boolean',
    default: true,
  })
  active?: boolean;

  @property({
    type: 'date',
    default: '',
  })
  createdAt?: string;

  @property({
    type: 'number',
  })
  commitmentId?: number;

  constructor(data?: Partial<StatusCommitments>) {
    super(data);
  }
}

export interface StatusCommitmentsRelations {
  // describe navigational properties here
}

export type StatusCommitmentsWithRelations = StatusCommitments &
  StatusCommitmentsRelations;
