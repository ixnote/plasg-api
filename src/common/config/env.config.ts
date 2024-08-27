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
  PLATEAU_KEY: config.get<string>('PLATEAU_KEY'),
  CLOUDINARY: config.get<string>('PLATEAU_KEY'),
  CLOUDINARY_NAME: config.get<string>('CLOUDINARY_NAME'),
  CLOUDINARY_API_KEY: config.get<string>('CLOUDINARY_API_KEY'),
  CLOUDINARY_API_SECRET: config.get<string>('CLOUDINARY_API_SECRET'),
  SMTP_HOST: config.get<string>('SMTP_HOST'),
  SMTP_NAME: config.get<string>('SMTP_NAME'),
  SMTP_PASS: config.get<string>('SMTP_PASS'),
  SMTP_PORT: config.get<number>('SMTP_PORT'),
  SMTP_USER:config.get<string>('SMTP_USER'),

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
