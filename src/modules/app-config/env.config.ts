export const generateEnvConfig = (config: Record<string, unknown>) => ({
  app: {
    NODE_ENV: config.NODE_ENV,
    PORT: config.PORT,
  },
  db: {
    HOST: config.DB_HOST,
    PORT: config.DB_PORT,
    USER: config.DB_USER,
    PASS: config.DB_PASS,
    NAME: config.DB_NAME,
  },
});
