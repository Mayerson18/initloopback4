import { DefaultCrudRepository, repository, HasManyRepositoryFactory } from '@loopback/repository';
import { Meeting, MeetingRelations, Commitment, Attendees } from '../models';
import { DbDataSource } from '../datasources';
import { inject, Getter } from '@loopback/core';
import { CommitmentRepository } from './commitment.repository';
import { AttendeesRepository } from './attendees.repository';

export class MeetingRepository extends DefaultCrudRepository<
  Meeting,
  typeof Meeting.prototype.id,
  MeetingRelations
  > {

  public readonly commitments: HasManyRepositoryFactory<Commitment, typeof Meeting.prototype.id>;

  public readonly attendees: HasManyRepositoryFactory<Attendees, typeof Meeting.prototype.id>;

  constructor(
    @inject('datasources.db') dataSource: DbDataSource, @repository.getter('CommitmentRepository') protected commitmentRepositoryGetter: Getter<CommitmentRepository>, @repository.getter('AttendeesRepository') protected attendeesRepositoryGetter: Getter<AttendeesRepository>,
  ) {
    super(Meeting, dataSource);
    this.attendees = this.createHasManyRepositoryFactoryFor('attendees', attendeesRepositoryGetter);
    this.registerInclusionResolver('attendees', this.attendees.inclusionResolver);
    this.commitments = this.createHasManyRepositoryFactoryFor('commitments', commitmentRepositoryGetter);
    this.registerInclusionResolver('commitments', this.commitments.inclusionResolver);
  }
}
