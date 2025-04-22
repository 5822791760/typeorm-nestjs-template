import { Global, Inject, Module, OnModuleDestroy } from '@nestjs/common';

import { CoreDB, KYSELY } from './db.common';
import { KyselyProvider } from './db.provider';

@Global()
@Module({
  providers: [KyselyProvider],
  exports: [KyselyProvider],
})
export class DBModule implements OnModuleDestroy {
  constructor(@Inject(KYSELY) private readonly db: CoreDB) {}

  async onModuleDestroy() {
    await this.db.destroy();
  }
}
