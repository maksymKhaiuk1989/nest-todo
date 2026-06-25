/* eslint-disable @typescript-eslint/restrict-template-expressions */
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
  supabase: {
    URL: config.SUPABASE_URL,
    STORAGE_URL: `${config.SUPABASE_URL}/storage/v1`,
    SERVICE_KEY: config.SUPABASE_SERVICE_KEY,
    BUCKET_NAME: config.SUPABASE_BUCKET_NAME,
  },
});
