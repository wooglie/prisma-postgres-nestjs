import { NestFactory } from '@nestjs/core';
import { ClsMiddleware, ClsService } from 'nestjs-cls';
import { VersioningType } from '@nestjs/common';
import { DatabaseService } from './core/database/database.service';
import { ConfigService } from '@nestjs/config';
import { Configuration } from './core/config/configuration';
import { LoggerService } from './core/logger/logger.service';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(
    new ClsMiddleware({
      useEnterWith: true,
    }).use,
  );

  const clsService = app.get(ClsService);
  const configService: ConfigService<Configuration, true> =
    app.get(ConfigService);

  // Replace default logger and inject dependent services in logger's constructor
  const logger = new LoggerService(clsService, configService);
  logger.setListeners();
  app.useLogger(logger);

  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  app.enableShutdownHooks();
  const databaseService: DatabaseService = app.get(DatabaseService);
  databaseService.enableShutdownHooks(app);

  await app.listen(configService.get('app.port', { infer: true }));

  return app.getUrl();
}
bootstrap();
