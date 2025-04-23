import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Queue } from 'bullmq';

import { AppConfig } from '@core/config';

@Injectable()
export abstract class BaseQueue implements OnModuleInit {
  abstract queueName: string;
  private _queue: Queue;

  constructor(private readonly configService: ConfigService) {}

  onModuleInit() {
    const redisConfig =
      this.configService.getOrThrow<AppConfig['redis']>('redis');

    this._queue = new Queue(this.queueName, {
      connection: { url: redisConfig.url },
    });
  }

  get q() {
    return this._queue;
  }
}
