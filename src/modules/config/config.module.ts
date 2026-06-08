import { Global, Module } from '@nestjs/common';
import { ConfigurableModuleClass } from '@src/modules/config/config.module-definition';
import { ConfigService } from '@src/modules/config/config.service';

@Global()
@Module({
  providers: [ConfigService],
  exports: [ConfigService],
})
export class ConfigModule extends ConfigurableModuleClass {}
