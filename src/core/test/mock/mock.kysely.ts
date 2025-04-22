import { Global, Module, Provider } from '@nestjs/common';
import { DataSource } from 'typeorm';

const MockKyselyProvider: Provider = {
  provide: DataSource,
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
