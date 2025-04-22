import { CamelCasePlugin, Kysely, PostgresDialect } from 'kysely';
import { Pool } from 'pg';

import { config } from '../config';
import { DB } from './db';

const dbConfig = config().database;
const kyselyDB = new Kysely<DB>({
  dialect: new PostgresDialect({
    pool: new Pool({
      connectionString: dbConfig.url,
    }),
  }),
  log: ['query', 'error'],
  plugins: [new CamelCasePlugin()],
});

export default kyselyDB;
