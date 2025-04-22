import { PostgreSqlContainer } from '@testcontainers/postgresql';
import { CamelCasePlugin, Kysely, PostgresDialect } from 'kysely';
import { Pool } from 'pg';
import 'tsconfig-paths/register';

import { CoreDB, runMigrations, runSeeds } from '@core/db/db.common';

export default async () => {
  const pgContainer = await new PostgreSqlContainer().start();

  const kyselyDB = new Kysely({
    dialect: new PostgresDialect({
      pool: new Pool({
        connectionString: pgContainer.getConnectionUri(),
      }),
    }),
    plugins: [new CamelCasePlugin()],
  }) as CoreDB;

  globalThis.pgContainer = pgContainer;
  globalThis.kyselyDB = kyselyDB;

  await runMigrations(kyselyDB);

  await runSeeds(kyselyDB);

  console.log('PostgreSQL container started.');
};
