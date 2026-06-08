import { ConfigurableModuleBuilder } from '@nestjs/common';
import { AppConfig } from '@src/modules/config/config.interface';

export const { ConfigurableModuleClass, MODULE_OPTIONS_TOKEN } =
  new ConfigurableModuleBuilder<AppConfig>()
    .setClassMethodName('forRoot')
    .build();
