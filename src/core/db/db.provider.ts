import { Provider } from '@nestjs/common';

import { KYSELY } from './db.common';
import kyselyDB from './db.kysely';

export const KyselyProvider: Provider = {
  provide: KYSELY,
  useFactory: () => kyselyDB,
};
