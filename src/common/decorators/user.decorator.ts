import { ExecutionContext, createParamDecorator, Logger } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validateOrReject } from 'class-validator';
import { Request } from 'express';
import { UserResponseDto } from '@src/modules/user/dto/user-response.dto';

export const User = createParamDecorator(
  async (
    data,
    context: ExecutionContext,
  ): Promise<UserResponseDto | undefined> => {
    const request = context.switchToHttp().getRequest<Request>();
    const rawUser = request.get('x-user-id');
    const logger = new Logger('UserDecorator');

    if (typeof rawUser !== 'string') {
      return undefined;
    }

    try {
      const parsed: unknown = JSON.parse(rawUser);
      const userInstance = plainToInstance(UserResponseDto, parsed);

      await validateOrReject(userInstance);

      return userInstance;
    } catch (error) {
      logger.log('Invalid user header', error);
    }
  },
);
