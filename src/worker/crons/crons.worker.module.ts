import { Module } from '@nestjs/common';

import QUEUE from '@core/shared/worker/worker.queue';
import { createWorkerHandler } from '@core/shared/worker/worker.util';

import { CronsWorkerRepo } from './crons.worker.repo';
import { CronsWorkerHandler } from './handler/crons.worker.handler';

@Module({
  providers: [
    CronsWorkerRepo,

    // Handler
    createWorkerHandler(QUEUE.crons, CronsWorkerHandler),
  ],
})
export class CronsWorkerModule {}
