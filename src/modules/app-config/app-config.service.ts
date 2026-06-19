import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  EnvironmentVariables,
  NodeEnv,
} from '@src/modules/app-config/env.validation';

@Injectable()
export class AppConfigService {
  private readonly config: EnvironmentVariables;

  constructor(
    private configService: ConfigService<EnvironmentVariables, true>,
  ) {
    this.config = {
      app: this.configService.getOrThrow('app', { infer: true }),
      db: this.configService.getOrThrow('db', { infer: true }),
      cache: this.configService.getOrThrow('cache', { infer: true }),
    };
  }

  get app() {
    return this.config.app;
  }

  get db() {
    return this.config.db;
  }

  get cache() {
    return this.config.cache;
  }

  // helpers
  get isDevelopment() {
    return this.app.NODE_ENV !== NodeEnv.PRODUCTION;
  }

  get isProduction() {
    return this.app.NODE_ENV === NodeEnv.PRODUCTION;
  }
}
