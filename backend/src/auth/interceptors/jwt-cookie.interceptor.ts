import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Response } from 'express';
import { Observable, tap } from 'rxjs';

@Injectable()
export class JwtCookieInterceptorInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const httpContext = context.switchToHttp();
    const response = httpContext.getResponse<Response>();

    return next.handle().pipe(
      tap((data) => {
        if (data?.token) {
          response.cookie('auth', data.token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'none',
            maxAge: 1000 * 60 * 60 * 24,
          });
        }
      }),
    );
  }
}
