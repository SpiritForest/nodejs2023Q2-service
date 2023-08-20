import { ConsoleLogger } from '@nestjs/common';
import { mkdirSync, writeFileSync } from 'fs';
import * as path from 'path';
// import { Injectable, Scope } from '@nestjs/common';

// @Injectable({ scope: Scope.TRANSIENT })
export class CustomLogger extends ConsoleLogger {
  basePath: string;

  constructor(filePath: string) {
    super();
    this.basePath = path.join(__dirname, filePath);
  }

  log(...args: [any, string?, string?]) {
    // log(message: any, stack?: string, context?: string) {
    super.log(...args);
    this.write(...args);
  }

  warn(...args: [any, string?, string?]) {
    super.warn(...args);
    this.write(...args);
  }

  debug(...args: [any, string?, string?]) {
    super.debug(...args);
    this.write(...args);
  }

  verbose(...args: [any, string?, string?]) {
    super.verbose(...args);
    this.write(...args);
  }

  error(...args: [any, string?, string?]) {
    super.error(...args);
    this.write(...args);
  }

  protected write(...args: [any, string?, string?]) {
    const [message, stack, context] = args;

    mkdirSync(this.basePath, {
      recursive: true,
    });

    writeFileSync(path.join(this.basePath, 'logs.log'), message + '\r\n', {
      encoding: 'utf-8',
      flag: 'a',
    });
  }
}
