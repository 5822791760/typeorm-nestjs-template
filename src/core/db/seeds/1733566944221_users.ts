import type { Kysely } from 'kysely';
import { InsertExpression } from 'kysely/dist/cjs/parser/insert-values-parser';

import { DEFAULT_PASSWORD } from '@core/util/common/common.constant';
import { hashString } from '@core/util/common/common.crypto';

import { DB } from '../db';

type User = InsertExpression<DB, 'users'>;

export async function seed(db: Kysely<DB>): Promise<void> {
  const superadmin: User = {
    email: 'superadmin@example.com',
    password: hashString(DEFAULT_PASSWORD),
  };

  const general: User = {
    email: 'general@example.com',
    password: hashString(DEFAULT_PASSWORD),
  };

  await db.insertInto('users').values([superadmin, general]).execute();
}
