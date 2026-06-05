import { ExecutionContext, createParamDecorator, Logger } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validateOrReject } from 'class-validator';
import { UserDto } from '@src/core/dto/user.dto';
import { Request } from 'express';

export const User = createParamDecorator(
  async (data, context: ExecutionContext): Promise<UserDto | undefined> => {
    const request = context.switchToHttp().getRequest<Request>();
    const rawUser = request.get('x-user-id');
    const logger = new Logger('UserDecorator');

    if (typeof rawUser !== 'string') {
      return undefined;
    }

    try {
      const parsed: unknown = JSON.parse(rawUser);

      const userInstance = plainToInstance(UserDto, parsed);

      await validateOrReject(userInstance);

      return userInstance;
    } catch {
      logger.log('Invalid user header');
    }
  },
);
