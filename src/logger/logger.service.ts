import { ConsoleLogger } from '@nestjs/common';
import { mkdirSync } from 'fs';
import { writeFile } from 'fs/promises';
import * as path from 'path';
import config from '../config';

export class CustomLogger extends ConsoleLogger {
  basePath: string;
  
  constructor(filePath: string) {
    super();
    this.basePath = path.join(__dirname + '../../', filePath);
  }

  debug(...args: [any, string?, string?]) {
    const logLevel = 4;

    super.debug(...args);

    if (logLevel > config.LOG_LEVEL) { return; }

    this.write(...args);
  }

  verbose(...args: [any, string?, string?]) {
    const logLevel = 3;
    
    super.verbose(...args);

    if (logLevel > config.LOG_LEVEL) { return; }

    this.write(...args);
  }

  log(...args: [any, string?, string?]) {
    const logLevel = 2;

    super.log(...args);

    console.log(config.LOG_LEVEL)
    if (logLevel > config.LOG_LEVEL) { return; }

    this.write(...args);
  }

  warn(...args: [any, string?, string?]) {
    const logLevel = 1;
    
    super.warn(...args);

    if (logLevel > config.LOG_LEVEL) { return; }

    this.write(...args);
  }

  error(...args: [any, string?, string?]) {
    const logLevel = 0;
    
    super.error(...args);

    if (logLevel > config.LOG_LEVEL) { return; }

    this.write(...args);
    this.writeErrors(...args);
  }

  protected write(...args: [any, string?, string?]) {
    const [message, stack, context] = args;

    mkdirSync(this.basePath, {
      recursive: true,
    });

    writeFile(path.join(this.basePath, 'logs.log'), message + '\r\n', {
      encoding: 'utf-8',
      flag: 'a',
    });
  }


  protected writeErrors(...args: [any, string?, string?]) {
    const [message, stack, context] = args;

    mkdirSync(this.basePath, {
      recursive: true,
    });

    writeFile(path.join(this.basePath, 'logsErrors.log'), message + '\r\n', {
      encoding: 'utf-8',
      flag: 'a',
    });
  }
}
