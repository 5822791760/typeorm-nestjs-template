import { Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient } from 'redis';

import { AppConfig } from '@core/config';

export const REDIS_CLIENT = Symbol('REDIS_CLIENT');

export const RedisCacheProvider: Provider = {
  provide: REDIS_CLIENT,
  inject: [ConfigService],
  useFactory: async (configService: ConfigService) => {
    const redisConfig = configService.getOrThrow<AppConfig['redis']>('redis');
    const appConfig = configService.getOrThrow<AppConfig['app']>('app');

    const client = createClient({
      url: redisConfig.url,
    });

    if (appConfig.enableCache) {
      await client.connect();
    }

    return client;
  },
};
