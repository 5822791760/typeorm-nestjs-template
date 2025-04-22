import { NestFactory } from '@nestjs/core';

import { config } from '@core/config';
import { KYSELY, runMigrations } from '@core/db/db.common';
import { coreLogger } from '@core/util/common/common.logger';
import { setupApp, setupSwagger } from '@core/util/http/http.setup';

import { AppModule } from './app.module';

const appConfig = config().app;
const dbConfig = config().database;

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: coreLogger(appConfig),
  });

  setupApp(app);

  if (appConfig.enableSwagger) {
    setupSwagger(app);
  }

  // Run migration
  if (dbConfig.enableAutoMigrate) {
    await runMigrations(app.get(KYSELY));
  }

  await app.listen(appConfig.port);
}
bootstrap();
