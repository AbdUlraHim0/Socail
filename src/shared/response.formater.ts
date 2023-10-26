import {
  CallHandler,
  ExecutionContext,
  HttpException,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { map } from 'rxjs/operators';
import { catchError, of } from 'rxjs';
import { Request, Response as ExpressResponse } from 'express';

export interface Response<T> {
  statusCode: number;
  message: string;
  data: T;
}

@Injectable()
export class ResponseFormatterInterceptor<T>
  implements NestInterceptor<T, Response<T>>
{
  private readonly logger = new Logger(this.constructor.name);

  intercept(context: ExecutionContext, next: CallHandler): any {
    return next.handle().pipe(
      map((result) => ({
        statusCode: context.switchToHttp().getResponse().statusCode,
        path: context.switchToHttp().getRequest().url,
        message: result?.message || null,
        data: result?.data || null,
      })),
      catchError((exception) => {
        const ctx = context.switchToHttp();
        const response = ctx.getResponse<ExpressResponse>();
        const request = ctx.getRequest<Request>();
        const statusCode =
          exception?.statusCode ||
          exception.status ||
          exception?.error?.statusCode ||
          response.statusCode;

        const exceptionResponse = {
          statusCode: statusCode,
          path: request.url,
          error: exception.error || null,
        };

        if (exceptionResponse.statusCode < 400) {
          exceptionResponse.statusCode = 500;
        }
        this.logger.error(exception);
        this.handleUncaughtHttpException(exception, exceptionResponse);

        response.status(exceptionResponse.statusCode);
        return of(exceptionResponse);
      }),
    );
  }

  getReasonParameter(
    reasons: { id: string; value: string[] }[],
    reason: string,
  ) {
    const spaceIndex = reason.indexOf(' ');
    const key = reason.slice(0, spaceIndex);
    const description = reason.slice(spaceIndex, reason.length).trim();

    const existingReason = reasons.find((r) => r.id == key);

    if (!existingReason) {
      const newReason = { id: key, value: [description] };
      reasons.push(newReason);
    } else {
      existingReason.value.push(description);
    }
  }

  private handleUncaughtHttpException(
    exception: any,
    exceptionResponse: Record<string, any>,
  ) {
    if (exception instanceof HttpException) {
      this.logger.error(exception);
      const errorResponse = exception.getResponse() as {
        message: string | string[];
      };
      const message = errorResponse.message;
      let reasons = undefined;

      if (message && Array.isArray(message)) {
        reasons = [];

        message.forEach((reason) => {
          if (Array.isArray(reason)) {
            reason.forEach((reason) =>
              this.getReasonParameter(reasons, reason),
            );
          } else if (typeof reason === 'string') {
            this.getReasonParameter(reasons, reason);
          }
        });
      }

      exceptionResponse.error = {
        exception: exception.name,
        description: exception.message,
        reasons,
      };

      exceptionResponse.statusCode = exception.getStatus();
    }
  }
}
