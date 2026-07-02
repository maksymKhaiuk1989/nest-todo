import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Public } from '@src/common/decorators/is-public.decorator';
import { App_ErrorUnauthorized } from '@src/common/exceptions';
import { AppConfigService } from '@src/modules/app-config/app-config.service';
import { UserRequestPayloadJWT } from '@src/modules/auth/types';

import { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private readonly jwtService: JwtService,
    private readonly config: AppConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride(Public, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new App_ErrorUnauthorized('Access token token not found');
    }
    try {
      const payload = await this.jwtService.verifyAsync<UserRequestPayloadJWT>(
        token,
        {
          secret: this.config.auth.JWT_ACCESS_SECRET,
        },
      );
      request['user'] = payload;
    } catch {
      throw new App_ErrorUnauthorized('Access token is invalid or expired');
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
