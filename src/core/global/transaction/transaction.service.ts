import { Injectable } from '@nestjs/common';
import { AsyncLocalStorage } from 'async_hooks';

import { TxDB } from '@core/db/db.common';

@Injectable()
export class TransactionService {
  private _transactionStorage = new AsyncLocalStorage<TxDB>();

  setTransaction(trx: TxDB) {
    this._transactionStorage.enterWith(trx);
  }

  getTransaction(): TxDB | null {
    return this._transactionStorage.getStore() ?? null;
  }
}
