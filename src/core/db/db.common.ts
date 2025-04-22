import { promises as fs } from 'fs';
import {
  Expression,
  ExpressionBuilder,
  FileMigrationProvider,
  Kysely,
  Migrator,
  SelectQueryBuilder,
  Selectable,
  Transaction,
} from 'kysely';
import { InsertObject } from 'kysely/dist/cjs/parser/insert-values-parser';
import { UpdateObject } from 'kysely/dist/cjs/parser/update-set-parser';
import * as path from 'path';

import { DB } from './db';

export const KYSELY = 'KYSELY';

export type CoreDB = Kysely<DB>;

type writeOperation =
  | 'deleteFrom'
  | 'updateTable'
  | 'insertInto'
  | 'replaceInto'
  | 'mergeInto';
export type ReadDB = Omit<CoreDB, writeOperation | 'transaction'>;
export type WriteDB = Pick<CoreDB, writeOperation>;

export type TxDB = Transaction<DB>;
export type DBInsertData<T extends keyof DB> = InsertObject<DB, T>;
export type DBUpdateData<T extends keyof DB> = UpdateObject<DB, T, T>;
export type DBModel<T> = Selectable<T>;
export type Strict<T, Shape> = T extends Shape
  ? Exclude<keyof T, keyof Shape> extends never
    ? T
    : never
  : never;

export type EB<T extends keyof DB> = ExpressionBuilder<DB, T>;
export type EX<T> = Expression<T>;
export type SelectQB<T extends keyof DB> = SelectQueryBuilder<DB, T, object>;

export async function runMigrations(db: CoreDB) {
  const migrator = new Migrator({
    db,
    provider: new FileMigrationProvider({
      fs,
      path,
      migrationFolder: path.join(__dirname, 'migrations'),
    }),
  });

  return migrator.migrateToLatest();
}

// Use in test ONLY
export async function runSeeds(db: CoreDB) {
  const seedDirs = __dirname + '/seeds';
  const seedFiles = await fs.readdir(seedDirs);
  const seedModules = seedFiles.sort();

  for (const file of seedModules) {
    try {
      const modulePath = `${seedDirs}/${file}`;
      const seedModule = await import(modulePath);

      if (typeof seedModule.seed === 'function') {
        await seedModule.seed(db);
      } else {
        console.warn(`Warning: ${file} does not export a seed function`);
      }
    } catch (error) {
      console.error(`Error running seed ${file}:`, error);
      throw error;
    }
  }
}
