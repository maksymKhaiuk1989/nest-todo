export const generateEnvConfig = (config: Record<string, unknown>) => ({
  app: {
    NODE_ENV: config.NODE_ENV,
    PORT: config.PORT,
  },
  cache: {
    REDIS_HOST: config.REDIS_HOST,
    REDIS_PORT: config.REDIS_PORT,
    REDIS_CACHE_TTL: config.REDIS_CACHE_TTL,
    REDIS_PASSWORD: config.REDIS_PASSWORD,
  },
  db: {
    HOST: config.DB_HOST,
    PORT: config.DB_PORT,
    USER: config.DB_USER,
    PASS: config.DB_PASS,
    NAME: config.DB_NAME,
  },
});
