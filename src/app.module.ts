import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ComponentModule } from './modules/component/component.module';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { env } from './common/config/env.config';
import { ThrottlerModule } from '@nestjs/throttler';
import { MdaModule } from './modules/mda/mda.module';
import { SeederModule } from './modules/seeder/seeder.module';
import { TagModule } from './modules/tag/tag.module';
import { ResourceModule } from './modules/resource/resource.module';
import { NewsModule } from './modules/news/news.module';
import { StaticsModule } from './modules/statics/statics.module';

const { MONGO_URI } = env;

@Module({
  controllers: [AppController],
  providers: [AppService],
  imports: [
    UserModule,
    ComponentModule,
    AuthModule,
    MongooseModule.forRoot(MONGO_URI),
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 10,
      },
    ]),
    MdaModule,
    SeederModule,
    TagModule,
    ResourceModule,
    NewsModule,
    StaticsModule,
  ],
})
export class AppModule {}
