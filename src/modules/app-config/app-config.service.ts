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
      supabase: this.configService.getOrThrow('supabase', { infer: true }),
      auth: this.configService.getOrThrow('auth', { infer: true }),
      client: this.configService.getOrThrow('client', { infer: true }),
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

  get supabase() {
    return this.config.supabase;
  }

  get auth() {
    return this.config.auth;
  }

  get client() {
    return this.config.client;
  }

  // helpers
  get isLocal() {
    return this.app.NODE_ENV === NodeEnv.LOCAL;
  }

  get isDevelopment() {
    return this.app.NODE_ENV !== NodeEnv.PRODUCTION;
  }

  get isProduction() {
    return this.app.NODE_ENV === NodeEnv.PRODUCTION;
  }
}
