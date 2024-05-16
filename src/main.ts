import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';
import { serveMain } from './serve';
import { AppModule } from './app.module';

import * as cookieParser from 'cookie-parser';
import { SeederService } from './modules/seeder/seeder.service';
const PORT = Number(process.env.PORT || 4002);

async function bootstrap() {
  const logger = new Logger('Spikk-Server');
  const app = serveMain(await NestFactory.create(AppModule));
  

  const seederService = app.get(SeederService);
  await seederService.seed(); 
  
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.use(cookieParser());

  await app.listen(PORT, () =>
    logger.log(`
    ************************************************
            Welcome to Spikk Mobile App. Server listening on port: ${PORT}   
    ************************************************
  `),
  );
}
bootstrap();