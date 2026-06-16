import { Module, ValidationPipe } from '@nestjs/common';
import { APP_PIPE } from '@nestjs/core';
import { AppConfigService } from '@src/modules/app-config/app-config.service';

@Module({
  providers: [
    {
      provide: APP_PIPE,
      useFactory: (config: AppConfigService) => {
        return new ValidationPipe({
          transform: true,
          whitelist: true,
          forbidNonWhitelisted: true,
          enableDebugMessages: config.isDevelopment,
          disableErrorMessages: config.isProduction,
        });
      },
      inject: [AppConfigService],
    },
  ],
})
export class ValidationModule {}
