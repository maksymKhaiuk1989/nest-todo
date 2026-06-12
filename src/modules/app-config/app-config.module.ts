import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { validateEnvVars } from '@src/modules/app-config/env.validation';
import { AppConfigService } from '@src/modules/app-config/app-config.service';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      validate: validateEnvVars,
      isGlobal: true,
      cache: true,
    }),
  ],
  providers: [AppConfigService],
  exports: [AppConfigService],
})
export class AppConfigModule {}
