import { INestApplicationContext, Provider } from '@nestjs/common';
import { Job, Worker } from 'bullmq';

import { config } from '@core/config';

const redisConfig = config().redis;

function addNamePrefix(name: string) {
  return `worker-${name}`;
}

export function createWorker(app: INestApplicationContext, queue: string) {
  const handler = app.get(addNamePrefix(queue));

  new Worker(
    queue,
    async (job: Job) => {
      await handler.dispatch(job);
    },
    { connection: { url: redisConfig.url } },
  );
}

export function createTaskHandler(key: string, clazz: any): Provider {
  return {
    provide: addNamePrefix(key),
    useClass: clazz,
  };
}
