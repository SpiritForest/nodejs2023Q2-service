import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { CustomLogger } from '../logger/logger.service';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new CustomLogger('../logs');

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, url, body, query } = request;
    const startDate = new Date();



    const response = context.switchToHttp().getResponse();
    const { statusCode } = response;

    return next.handle().pipe(
      tap(() => {
        const logMessage = `
          Request:
            - Time: ${new Date()}
            - Method: ${method}
            - URL: ${url}
            - Query: ${JSON.stringify(query)}
            - Body: ${JSON.stringify(body)}
          Response:
            - Status: ${statusCode}
          Execution Time, ms: ${new Date().getTime() - startDate.getTime()}
        `;
        this.logger.log(logMessage);
      }),
    );
  }
}
