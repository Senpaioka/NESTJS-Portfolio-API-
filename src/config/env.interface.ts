export interface EnvironmentVariables {
  PORT: number;
  NODE_ENV: string;

  FRONTEND_URL: string;
  DATABASE_URL: string;
  DIRECT_URL: string;

  THROTTLE_TTL: number;
  THROTTLE_LIMIT: number;

  JWT_ACCESS_SECRET: string;
  JWT_REFRESH_SECRET: string;
  JWT_ACCESS_EXPIRES_IN: string;
  JWT_REFRESH_EXPIRES_IN: string;

  MAIL_HOST: string;
  MAIL_PORT: string;
  MAIL_USER: string;
  MAIL_PASSWORD: string;
  MAIL_FROM: string;
}
