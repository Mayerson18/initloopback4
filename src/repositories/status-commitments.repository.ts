import {DefaultCrudRepository} from '@loopback/repository';
import {StatusCommitments, StatusCommitmentsRelations} from '../models';
import {DbDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class StatusCommitmentsRepository extends DefaultCrudRepository<
  StatusCommitments,
  typeof StatusCommitments.prototype.id,
  StatusCommitmentsRelations
> {
  constructor(@inject('datasources.db') dataSource: DbDataSource) {
    super(StatusCommitments, dataSource);
  }
}
