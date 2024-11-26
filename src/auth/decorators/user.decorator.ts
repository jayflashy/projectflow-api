import { Request } from 'express';
import { User } from '@prisma/client';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

declare module 'express' {
  interface Request {
    user?: Omit<User, 'password'>;
  }
}

export const AuthUser = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext): unknown => {
    const request: Request = ctx.switchToHttp().getRequest();
    const user = request.user;
    return data ? user?.[data as keyof User] : user;
  },
);
