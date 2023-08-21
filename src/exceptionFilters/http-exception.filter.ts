import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { Request, Response } from 'express';

import { CustomLogger } from '../logger/logger.service'; 

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
    private readonly logger = new CustomLogger('./logs');

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const statusCode = exception.getStatus();
    const { method, url, body, query } = request;

    const logMessage = `
        HTTP Exception:
            Request:
            - Timestamp: ${new Date().toISOString()}
            - Method: ${method}
            - URL: ${url}
            - Query: ${JSON.stringify(query)}
            - Body: ${JSON.stringify(body)}
            Response:
            - Status: ${statusCode}`;

    this.logger.log(logMessage);

    response
      .status(statusCode)
      .json({
        statusCode,
        timestamp: new Date().toISOString(),
        path: request.url,
      });
  }
}