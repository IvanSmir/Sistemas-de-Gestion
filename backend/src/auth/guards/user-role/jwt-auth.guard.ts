// jwt-auth.guard.ts
import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  handleRequest(err, user, info, context: ExecutionContext) {
    const req = context.switchToHttp().getRequest<Request>();
    if (err || !user) {
      throw err || new UnauthorizedException();
    }
    return user;
  }

  getRequest(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest<Request>();

    console.log(req);
    const token = req.cookies['auth'];
    console.log(token);
    if (token) {
      req.headers.authorization = `Bearer ${token}`;
    }
    return req;
  }
}
