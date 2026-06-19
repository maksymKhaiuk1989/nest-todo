import { NestFactory } from '@nestjs/core';
import { AppModule } from '@src/app.module';
import { AppConfigService } from '@src/modules/app-config/app-config.service';
import { setupApp } from '@src/config/setupApp';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(AppConfigService);

  setupApp(app, config);

  await app.listen(config.app.PORT);
}

void bootstrap();
