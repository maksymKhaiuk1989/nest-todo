import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import {
  App_ErrorBase,
  App_ErrorUnauthorized,
  App_ErrorNotFound,
  App_ErrorBadRequest,
} from '@src/common/exceptions';
import { AppConfigService } from '@src/modules/app-config/app-config.service';

@Catch(App_ErrorBase)
export class CustomExceptionFilter implements ExceptionFilter {
  constructor(private readonly config: AppConfigService) {}
  catch(exception: App_ErrorBase, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;

    if (exception instanceof App_ErrorUnauthorized) {
      status = HttpStatus.UNAUTHORIZED;
    } else if (exception instanceof App_ErrorBadRequest) {
      status = HttpStatus.BAD_REQUEST;
    } else if (exception instanceof App_ErrorNotFound) {
      status = HttpStatus.NOT_FOUND;
    }

    response.status(status).json({
      statusCode: status,
      message: exception.message,
      error: exception.errorCode,
      cause: this.config.isProduction ? undefined : exception.cause,
      stack: this.config.isProduction ? undefined : exception.stack,
    });
  }
}
