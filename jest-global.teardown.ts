import 'tsconfig-paths/register';

export default async () => {
  if (globalThis.kyselyDB) {
    await globalThis.kyselyDB.destroy();
  }

  if (globalThis.pgContainer) {
    await globalThis.pgContainer.stop();
  }
  console.log('PostgreSQL container destroyed.');
};
