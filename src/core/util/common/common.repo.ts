import { Inject } from '@nestjs/common';

import { CoreDB, KYSELY, ReadDB, WriteDB } from '@core/db/db.common';
import { TransactionService } from '@core/global/transaction/transaction.service';

import { ExceptionErr, Ok, Res } from './common.neverthrow';

export abstract class BaseRepo {
  constructor(
    @Inject(KYSELY)
    private coreDB: CoreDB,
    private transactionService: TransactionService,
  ) {}

  async transaction<T>(
    callback: () => Promise<T>,
  ): Promise<Res<T, 'internal'>> {
    try {
      const res = await this.coreDB.transaction().execute(async (tx) => {
        this.transactionService.setTransaction(tx);
        return callback();
      });
      return Ok(res);
    } catch (e: any) {
      return ExceptionErr('internal', e);
    }
  }

  protected get db(): ReadDB {
    return this._currentTransaction() ?? this.coreDB;
  }

  protected get writeDb(): WriteDB {
    return this._currentTransaction() ?? this.coreDB;
  }

  private _currentTransaction() {
    return this.transactionService.getTransaction();
  }
}
