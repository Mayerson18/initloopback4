import { DefaultCrudRepository } from '@loopback/repository';
import { Commitment, CommitmentRelations } from '../models';
import { DbDataSource } from '../datasources';
import { inject } from '@loopback/core';

export class CommitmentRepository extends DefaultCrudRepository<
  Commitment,
  typeof Commitment.prototype.id,
  CommitmentRelations
  > {
  constructor(
    @inject('datasources.db') dataSource: DbDataSource,
  ) {
    super(Commitment, dataSource);
  }
}
