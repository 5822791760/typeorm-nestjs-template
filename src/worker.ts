import { NestFactory } from '@nestjs/core';

import { createWorker } from '@core/shared/worker/worker.util';

import { WorkerAppModule } from './worker/worker.module';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(WorkerAppModule);

  createWorker(app);
}
bootstrap();
