import { Logger } from '@nestjs/common';
import { generateEnvConfig } from '@src/modules/app-config/env.config';

import { plainToInstance, Type } from 'class-transformer';
import {
  IsEnum,
  IsNumber,
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

  @IsNumber()
  @Min(0)
  @Max(65535)
  PORT: number;
}

export class EnvironmentVariables {
  @ValidateNested()
  @Type(() => AppConfig)
  app: AppConfig;
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
