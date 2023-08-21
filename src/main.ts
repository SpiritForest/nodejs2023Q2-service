import { NestFactory, HttpAdapterHost } from '@nestjs/core';
import { SwaggerModule } from '@nestjs/swagger';
import * as yaml from 'js-yaml';
import { readFileSync } from 'fs';

import { AppModule } from './app.module';
import config from './config';
import { CustomLogger } from './logger/logger.service';
import { LoggingInterceptor } from './interceptors/logging.interceptor';
import { AllExceptionsFilter } from './exceptionFilters/catch-everything.filter';
import { HttpExceptionFilter } from './exceptionFilters/http-exception.filter';

async function bootstrap() {
  const logger = new CustomLogger('./logs');
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });

  process.on('unhandledRejection', (reason, promise) => {
    logger.error(`
    Unhandled Rejection at: ${JSON.stringify(promise)}, 
    reason: ${reason}`);
  });

  process.on('uncaughtException', (error) => {
    logger.error(`
    UUncaught Exception: ${JSON.stringify(error)}', 
    reason: ${reason}`);'
  });

  app.useLogger(logger);
  app.useGlobalFilters(
    new AllExceptionsFilter(app.get(HttpAdapterHost)),
    new HttpExceptionFilter(),
  );
  app.useGlobalInterceptors(new LoggingInterceptor());

  const data = readFileSync('./doc/api.yaml', 'utf8');
  const yamlData = yaml.load(data);

  SwaggerModule.setup('doc', app, yamlData);

  await app.listen(config.PORT);
}
bootstrap();
