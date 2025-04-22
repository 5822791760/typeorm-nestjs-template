import { SelectQueryBuilder } from 'kysely';

import { DB } from './db';

export async function queryCount(qb: SelectQueryBuilder<DB, keyof DB, any>) {
  const resp = await qb
    .clearSelect()
    .select(({ fn }) => fn.countAll().as('total'))
    .executeTakeFirst();

  if (!resp?.total) {
    return 0;
  }

  return parseInt(resp.total as string);
}

export async function queryExists(qb: SelectQueryBuilder<DB, keyof DB, any>) {
  const resp = await qb.clearSelect().select('id').executeTakeFirst();
  return !!resp?.id;
}
