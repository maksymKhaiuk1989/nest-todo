import { Logger } from '@nestjs/common';
import { generateEnvConfig } from '@src/modules/app-config/env.config';

import { plainToInstance, Type } from 'class-transformer';
import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsString,
  IsUrl,
  Matches,
  Max,
  Min,
  ValidateNested,
  validateSync,
} from 'class-validator';

export enum NodeEnv {
  LOCAL = 'local',
  STAGING = 'staging',
  PRODUCTION = 'production',
}

class AppConfig {
  @IsEnum(NodeEnv)
  NODE_ENV: NodeEnv;

  @IsInt()
  @Min(0)
  @Max(65535)
  PORT: number;
}

class CacheConfig {
  @IsString()
  @IsNotEmpty()
  REDIS_HOST: string;

  @IsInt()
  @Min(0)
  @Max(65535)
  REDIS_PORT: number;

  @IsInt()
  @Min(0)
  @Max(65535)
  REDIS_CACHE_TTL: number;

  @IsString()
  @IsNotEmpty()
  REDIS_PASSWORD: string;
}

class DbConfig {
  @IsString()
  @IsNotEmpty()
  HOST: string;

  @IsInt()
  @Min(0)
  @Max(65535)
  PORT: number;

  @IsString()
  @IsNotEmpty()
  USER: string;

  @IsString()
  @IsNotEmpty()
  PASS: string;

  @IsString()
  @IsNotEmpty()
  NAME: string;
}

class SupabaseConfig {
  @IsUrl()
  @IsNotEmpty()
  URL: string;

  @IsUrl()
  @IsNotEmpty()
  STORAGE_URL: string;

  @IsString()
  @IsNotEmpty()
  SERVICE_KEY: string;

  @IsString()
  @IsNotEmpty()
  BUCKET_NAME: string;
}

export class AuthConfig {
  @IsString()
  @IsNotEmpty()
  JWT_ACCESS_SECRET: string;

  @IsString()
  @Matches(/^\d+Minutes$/)
  JWT_ACCESS_EXPIRES_IN: `${number}Minutes`;

  @IsString()
  @IsNotEmpty()
  JWT_REFRESH_SECRET: string;

  @IsString()
  @Matches(/^\d+Days$/)
  JWT_REFRESH_EXPIRES_IN: `${number}Days`;

  @IsString()
  @IsNotEmpty()
  COOKIE_PARSER_SECRET: string;
}

export class EnvironmentVariables {
  @ValidateNested()
  @Type(() => AppConfig)
  app: AppConfig;

  @ValidateNested()
  @Type(() => DbConfig)
  db: DbConfig;

  @ValidateNested()
  @Type(() => CacheConfig)
  cache: CacheConfig;

  @ValidateNested()
  @Type(() => SupabaseConfig)
  supabase: SupabaseConfig;

  @ValidateNested()
  @Type(() => AuthConfig)
  auth: AuthConfig;
}

export function validateEnvVars(config: Record<string, unknown>) {
  const validatedConfig = plainToInstance(
    EnvironmentVariables,
    generateEnvConfig(config),
    {
      enableImplicitConversion: true,
    },
  );

  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
    whitelist: true,
    forbidNonWhitelisted: true,
  });

  if (errors.length > 0) {
    Logger.log(errors.toString());
    throw new Error(errors.toString());
  }

  return validatedConfig;
}
