import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { INestApplication, Logger } from '@nestjs/common';

import { NodeEnv } from '@src/modules/app-config/env.validation';
import { AppConfigService } from '@src/modules/app-config/app-config.service';

export function setupSwagger(app: INestApplication) {
  const appConfig = app.get(AppConfigService);

  if (appConfig.app.NODE_ENV === NodeEnv.PRODUCTION) {
    Logger.warn(
      `Swagger setup skipped in ${appConfig.app.NODE_ENV} environment`,
    );
    return;
  }

  const config = new DocumentBuilder()
    .setTitle('TODO Backend')
    .setDescription('CRUD API Documentation')
    .setVersion('1.0')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);
}
