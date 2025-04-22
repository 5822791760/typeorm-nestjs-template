import { CommandFactory } from 'nest-commander';

import { CliAppModule } from './cli/cli.module';

async function bootstrap() {
  const app = await CommandFactory.createWithoutRunning(CliAppModule);
  await CommandFactory.runApplication(app);
  await app.close();
}
bootstrap();
