import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { Request } from 'express';
import { JwtPayload } from '@src/types/jwt-payload';

export const User = createParamDecorator(
  (_data, context: ExecutionContext): JwtPayload | undefined => {
    const request = context.switchToHttp().getRequest<Request>();

    return request.user as JwtPayload;
  },
);
