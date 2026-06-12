import {
  EnvironmentVariables,
  NodeEnv,
} from '@src/modules/app-config/env.validation';

export const generateEnvConfig = (
  config: Record<string, unknown>,
): EnvironmentVariables => ({
  app: {
    NODE_ENV: config.NODE_ENV as NodeEnv,
    PORT: config.PORT as number,
  },
});
