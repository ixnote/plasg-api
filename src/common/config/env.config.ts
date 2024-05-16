import 'dotenv/config';
import { ConfigService } from '@nestjs/config';
import { Environments } from 'src/common/constants/enum';

const config = new ConfigService();
const ENVIRONMENT = config.get('NODE_ENV');

export const env = {
  NODE_ENV: ENVIRONMENT,
  JWT_ACCESS_SECRET: config.get<string>('JWT_ACCESS_SECRET'),
  JWT_REFRESH_SECRET: config.get<string>('JWT_REFRESH_SECRET'),
  MONGO_URI: config.get<string>('MONGO_URI'),
  PORT: config.get<number>('PORT'),
  PLATEAU_KEY: config.get<string>('PORT'),

  isDevelopment() {
    return this.NODE_ENV === Environments.DEVELOPMENT;
  },
  isStaging() {
    return this.NODE_ENV === Environments.STAGING;
  },
  isProduction() {
    return this.NODE_ENV === Environments.PRODUCTION;
  },
};
