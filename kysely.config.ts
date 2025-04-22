import { defineConfig } from 'kysely-ctl';

import kyselyDB from './src/core/db/db.kysely';

export default defineConfig({
  kysely: kyselyDB,
  migrations: {
    migrationFolder: './src/core/db/migrations',
  },
  seeds: {
    seedFolder: './src/core/db/seeds',
  },
});
