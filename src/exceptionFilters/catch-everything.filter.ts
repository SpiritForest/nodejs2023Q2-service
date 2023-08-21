import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
    HttpStatus,
  } from '@nestjs/common';
  import { HttpAdapterHost } from '@nestjs/core';
  import { CustomLogger } from '../logger/logger.service';
  
  @Catch()
  export class AllExceptionsFilter implements ExceptionFilter {
    private readonly logger = new CustomLogger('./logs');

    constructor(private readonly httpAdapterHost: HttpAdapterHost) {}
  
    catch(exception: unknown, host: ArgumentsHost): void {
      // In certain situations `httpAdapter` might not be available in the
      // constructor method, thus we should resolve it here.
      const { httpAdapter } = this.httpAdapterHost;
  
      const ctx = host.switchToHttp();
      const httpStatus =
        exception instanceof HttpException
          ? exception.getStatus()
          : HttpStatus.INTERNAL_SERVER_ERROR;
      const request = ctx.getRequest();
  
      const responseBody = {
        statusCode: httpStatus,
        timestamp: new Date().toISOString(),
        path: httpAdapter.getRequestUrl(request),
        message: exception instanceof Error ? exception.message : exception
      };
  
      const logMessage = `
        Server Exception:
            - Timestamp: ${new Date().toISOString()}
            - Method: ${httpAdapter.getRequestMethod(request)}
            - URL: ${httpAdapter.getRequestUrl(request)}
            - Status: ${httpStatus}
            - Message: ${exception instanceof Error ? exception.message : exception}`;

      this.logger.error(logMessage);

      httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
    }
  }