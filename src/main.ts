import { NestFactory } from '@nestjs/core';
import { SwaggerModule } from '@nestjs/swagger';
import * as yaml from 'js-yaml';
import { readFileSync } from 'fs';

import { AppModule } from './app.module';
import config from './config';
import { CustomLogger } from './logger/logger.service';
import { LoggingInterceptor } from './interceptors/logging.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });
  app.useLogger(new CustomLogger('../logs'));
  app.useGlobalInterceptors(new LoggingInterceptor());

  const data = readFileSync('./doc/api.yaml', 'utf8');
  const yamlData = yaml.load(data);

  SwaggerModule.setup('doc', app, yamlData);

  await app.listen(config.PORT);
}
bootstrap();
