import { Global, Module, Provider } from '@nestjs/common';

import { KYSELY } from '@core/db/db.common';

const MockKyselyProvider: Provider = {
  provide: KYSELY,
  useValue: {
    transaction: jest.fn().mockImplementation(() => ({
      execute: jest.fn(),
    })),
  },
};

@Global()
@Module({
  providers: [MockKyselyProvider],
  exports: [MockKyselyProvider],
})
export class MockDBModule {}
