import { INestApplication, Logger, VersioningType } from '@nestjs/common';
import { setupSwagger } from '@src/config/swagger.config';
import { AppConfigService } from '@src/modules/app-config/app-config.service';
import { Reflector } from '@nestjs/core';
import { ClassSerializerInterceptor } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import { CsrfService } from '@src/modules/auth/crsf.service';

export const setupApp = (app: INestApplication, config: AppConfigService) => {
  app.use(cookieParser(config.auth.COOKIE_PARSER_SECRET));

  app.enableCors({
    origin: config.client.CLIENT_URL.split(','),
    methods: 'GET,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  const csrfService = app.get(CsrfService);
  app.use(csrfService.protection);

  app.useGlobalInterceptors(
    new ClassSerializerInterceptor(app.get(Reflector), {
      excludePrefixes: ['_'],
    }),
  );

  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  setupSwagger(app, config);

  Logger.verbose(
    `
     APP STARTED: in ${config.app.NODE_ENV} environment,
     - PORT: ${config.app.PORT},
     -  TIME: ${new Date().toLocaleTimeString('uk-UA')}
     - SWAGGER: ${!config.isProduction ? 'http://localhost:3000/api' : 'NOT AVAILABLE'}
     - CLIENT URL: ${config.client.CLIENT_URL}
    `,
  );
};
