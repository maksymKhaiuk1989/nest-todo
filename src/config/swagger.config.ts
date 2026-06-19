import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { INestApplication, Logger } from '@nestjs/common';

import { AppConfigService } from '@src/modules/app-config/app-config.service';

export function setupSwagger(app: INestApplication, config: AppConfigService) {
  if (config.isProduction) {
    Logger.warn(`Swagger setup skipped in production`);
    return;
  }

  const swaggerConfig = new DocumentBuilder()
    .setTitle('TODO Backend')
    .setDescription('CRUD API Documentation')
    .setVersion('1.0')
    .build();
  const documentFactory = () =>
    SwaggerModule.createDocument(app, swaggerConfig);

  SwaggerModule.setup('api', app, documentFactory);
}
