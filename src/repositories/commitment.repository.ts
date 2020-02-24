import { DefaultCrudRepository, repository, HasManyRepositoryFactory} from '@loopback/repository';
import { Commitment, CommitmentRelations, StatusCommitments} from '../models';
import { DbDataSource } from '../datasources';
import { inject, Getter} from '@loopback/core';
import {StatusCommitmentsRepository} from './status-commitments.repository';

export class CommitmentRepository extends DefaultCrudRepository<
  Commitment,
  typeof Commitment.prototype.id,
  CommitmentRelations
  > {

  public readonly statusCommitments: HasManyRepositoryFactory<StatusCommitments, typeof Commitment.prototype.id>;

  constructor(
    @inject('datasources.db') dataSource: DbDataSource, @repository.getter('StatusCommitmentsRepository') protected statusCommitmentsRepositoryGetter: Getter<StatusCommitmentsRepository>,
  ) {
    super(Commitment, dataSource);
    this.statusCommitments = this.createHasManyRepositoryFactoryFor('statusCommitments', statusCommitmentsRepositoryGetter,);
    this.registerInclusionResolver('statusCommitments', this.statusCommitments.inclusionResolver);
  }
}
