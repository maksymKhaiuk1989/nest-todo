import { NestFactory } from '@nestjs/core';
import { setupSwagger } from '@config/swagger.config';
import { AppModule } from '@src/app.module';
import { AppConfigService } from '@src/modules/app-config/app-config.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const appConfig = app.get(AppConfigService);

  setupSwagger(app);

  await app.listen(appConfig.app.PORT);
}

void bootstrap();
