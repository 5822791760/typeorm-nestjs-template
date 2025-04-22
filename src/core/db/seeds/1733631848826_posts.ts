import { CoreDB } from '../db.common';

export async function seed(db: CoreDB): Promise<void> {
  const user = await db
    .selectFrom('users')
    .select('id')
    .where('email', '=', 'superadmin@example.com')
    .executeTakeFirst();

  if (!user) {
    throw new Error('Superadmin not found');
  }

  await db
    .insertInto('posts')
    .values([
      {
        title: 'test post A',
        details: 'post A details',
        createdBy: user.id,
      },
      {
        title: 'test post B',
        details: 'post B details',
        createdBy: user.id,
      },
    ])
    .execute();
}
