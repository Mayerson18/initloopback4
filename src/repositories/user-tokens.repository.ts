import { DefaultCrudRepository } from '@loopback/repository';
import { UserTokens, UserTokensRelations } from '../models/user-tokens.model';
import { DbDataSource } from '../datasources';
import { inject } from '@loopback/core';

export class UserTokensRepository extends DefaultCrudRepository<
  UserTokens,
  typeof UserTokens.prototype.id,
  UserTokensRelations
  > {
  constructor(
    @inject('datasources.db') dataSource: DbDataSource,
  ) {
    super(UserTokens, dataSource);
  }
}
