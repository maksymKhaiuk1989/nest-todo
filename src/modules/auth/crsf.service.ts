import { Injectable } from '@nestjs/common';
import { AppConfigService } from '@src/modules/app-config/app-config.service';
import { randomUUID } from 'crypto';
import { doubleCsrf, DoubleCsrfUtilities } from 'csrf-csrf';
import { CookieOptions, NextFunction, Request, Response } from 'express';

@Injectable()
export class CsrfService {
  private readonly csrfUtilities: DoubleCsrfUtilities;
  readonly csrfCookieName = 'x-csrf-token';
  readonly csrfSessionIdCookieName = 'csrf_session_id';
  readonly cookieOptions: CookieOptions;

  constructor(private config: AppConfigService) {
    this.cookieOptions = {
      httpOnly: true,
      sameSite: 'lax',
      secure: config.isProduction,
    };

    this.csrfUtilities = doubleCsrf({
      cookieName: this.csrfCookieName,
      cookieOptions: this.cookieOptions,
      size: 64,
      ignoredMethods: ['GET'],
      getSecret: () => this.config.auth.CSRF_SECRET,
      getSessionIdentifier: (req) => {
        const sessionId = req.cookies[this.csrfSessionIdCookieName] as string;

        return sessionId;
      },
      getCsrfTokenFromRequest: (req) => req.headers['x-csrf-token'],
    });
  }

  generateCsrfToken(req: Request, res: Response) {
    return this.csrfUtilities.generateCsrfToken(req, res);
  }

  generateSessionId(req: Request, res: Response) {
    const sessionId = randomUUID();
    req.cookies[this.csrfSessionIdCookieName] = sessionId;
    res.cookie(this.csrfSessionIdCookieName, sessionId, {
      httpOnly: true,
      sameSite: 'lax',
      secure: this.config.isProduction,
    });
  }

  protection = (req: Request, res: Response, next: NextFunction) => {
    this.csrfUtilities.doubleCsrfProtection(req, res, next);
  };
}
