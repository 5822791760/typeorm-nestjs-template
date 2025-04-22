import { NestFactory } from '@nestjs/core';

import { config } from '@core/config';
import { coreLogger } from '@core/util/common/common.logger';
import { setupApp, setupSwagger } from '@core/util/http/http.setup';

import { AppModule } from './app.module';

const appConfig = config().app;

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: coreLogger(appConfig),
  });

  setupApp(app);

  if (appConfig.enableSwagger) {
    setupSwagger(app);
  }

  await app.listen(appConfig.port);
}
bootstrap();
