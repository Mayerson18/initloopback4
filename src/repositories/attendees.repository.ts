import { DefaultCrudRepository } from '@loopback/repository';
import { Attendees, AttendeesRelations } from '../models/attendees.model';
import { DbDataSource } from '../datasources';
import { inject } from '@loopback/core';

export class AttendeesRepository extends DefaultCrudRepository<
  Attendees,
  typeof Attendees.prototype.id,
  AttendeesRelations
  > {
  constructor(
    @inject('datasources.db') dataSource: DbDataSource,
  ) {
    super(Attendees, dataSource);
  }
}
