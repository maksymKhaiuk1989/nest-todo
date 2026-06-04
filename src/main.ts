import { NestFactory } from '@nestjs/core';
import {setupSwagger} from "@config/swagger.config";
import {AppModule} from "@src/app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  setupSwagger(app);
  await app.listen(process.env.PORT ?? 3000);


}
bootstrap();
