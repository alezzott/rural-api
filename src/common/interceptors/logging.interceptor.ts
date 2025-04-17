import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, catchError, tap } from 'rxjs';
import { throwError } from 'rxjs';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger('App');

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req: Request = context.switchToHttp().getRequest<Request>();
    const method = req?.method;
    const url = req?.url;

    this.logger.log(`Request: ${method} ${url}`);

    return next.handle().pipe(
      tap((data) => {
        this.logger.debug(
          `Response: ${method} ${url} - ${JSON.stringify(data)}`,
        );
      }),
      catchError((error) => {
        if (error instanceof Error) {
          this.logger.error(
            `Error on ${method} ${url}: ${error.message}`,
            error.stack,
          );
        } else {
          this.logger.error(`Error on ${method} ${url}: ${String(error)}`);
        }
        return throwError(() => error as Error);
      }),
    );
  }
}
