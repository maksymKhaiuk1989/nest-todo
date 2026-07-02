import { UserRequestPayloadJWT } from '@src/modules/auth/types';
import { Request } from 'express';

declare global {
  namespace Express {
    interface Request {
      user?: UserRequestPayloadJWT;
    }
  }
}
