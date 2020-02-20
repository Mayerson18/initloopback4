import { Entity, model, property } from '@loopback/repository';

@model()
export class User extends Entity {
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
  firstName: string;

  @property({
    type: 'string',
    required: true,
    default: "",
  })
  lastName: string;

  @property({
    type: 'string',
    required: true,
    default: "",
  })
  password: string;

  @property({
    type: 'string',
    default: "",
  })
  verifiedEmail?: string;

  @property({
    type: 'string',
    required: true,
    default: "",
  })
  email: string;

  @property({
    type: 'array',
    itemType: 'string',
  })
  roles?: string[];

  constructor(data?: Partial<User>) {
    super(data);
  }
}

export interface UserRelations {
  // describe navigational properties here
}

export type UserWithRelations = User & UserRelations;
