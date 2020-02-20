import {Entity, model, property} from '@loopback/repository';

@model()
export class UserTokens extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @property({
    type: 'string',
    required: true,
  })
  token: string;

  @property({
    type: 'boolean',
    required: true,
    default: false,
  })
  status: boolean;

  @property({
    type: 'number',
    required: true,
  })
  userId: number;

  @property({
    type: 'string',
    required: true,
    default: '',
  })
  expiredAt: string;


  constructor(data?: Partial<UserTokens>) {
    super(data);
  }
}

export interface UserTokensRelations {
  // describe navigational properties here
}

export type UserTokensWithRelations = UserTokens & UserTokensRelations;
