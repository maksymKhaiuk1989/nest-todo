import { NestFactory, Reflector } from '@nestjs/core';
import { setupSwagger } from '@config/swagger.config';
import { AppModule } from '@src/app.module';
import { AppConfigService } from '@src/modules/app-config/app-config.service';
import { ClassSerializerInterceptor } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const appConfig = app.get(AppConfigService);
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  setupSwagger(app);

  await app.listen(appConfig.app.PORT);
}

void bootstrap();
