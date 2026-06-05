import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { Request } from 'express';

interface User {
  name: string;
}

export const User = createParamDecorator(
  (data, context: ExecutionContext): User | undefined => {
    const request = context.switchToHttp().getRequest<Request>();
    const user = request.get('x-user-id');

    if (!user || typeof user !== 'string') return undefined;

    try {
      return JSON.parse(user) as User;
    } catch {
      return undefined;
    }
  },
);
