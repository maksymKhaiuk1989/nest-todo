import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { Request } from 'express';
import { UserRequestPayloadJWT } from '@src/modules/auth/types';

export const User = createParamDecorator(
  (_data, context: ExecutionContext): UserRequestPayloadJWT | undefined => {
    const request = context.switchToHttp().getRequest<Request>();

    return request.user;
  },
);
