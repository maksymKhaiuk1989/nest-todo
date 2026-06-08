import { Inject, Injectable } from '@nestjs/common';
import type { AppConfig } from '@src/modules/config/config.interface';
import { MODULE_OPTIONS_TOKEN } from '@src/modules/config/config.module-definition';

@Injectable()
export class ConfigService {
  constructor(
    @Inject(MODULE_OPTIONS_TOKEN) private readonly config: AppConfig,
  ) {}

  get<K extends keyof AppConfig>(key: K): AppConfig[K] {
    return this.config[key];
  }
}
