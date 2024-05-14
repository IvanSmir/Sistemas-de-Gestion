import {
  ExecutionContext,
  InternalServerErrorException,
  createParamDecorator,
} from '@nestjs/common';

export const GetUser = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const { user } = request;
    if (!user)
      throw new InternalServerErrorException('User not found (request)');
    const { password, createdAt, updatedAt, ...userData } = user;

    return data ? userData[data] : userData;
  },
);
