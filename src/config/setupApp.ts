import { INestApplication, Logger } from '@nestjs/common';
import { setupSwagger } from '@src/config/swagger.config';
import { AppConfigService } from '@src/modules/app-config/app-config.service';
import { Reflector } from '@nestjs/core';
import { ClassSerializerInterceptor } from '@nestjs/common';

export const setupApp = (app: INestApplication, config: AppConfigService) => {
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  setupSwagger(app, config);

  Logger.verbose(
    `
     APP STARTED: in ${config.app.NODE_ENV} environment,
     - PORT: ${config.app.PORT},
     - TIME: ${new Date().toLocaleTimeString('uk-UA')}
    `,
  );
};
