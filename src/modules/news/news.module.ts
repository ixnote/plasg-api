import { Module } from '@nestjs/common';
import { NewsService } from './services/news.service';
import { NewsController } from './news.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { NewsSchema } from './schemas/news.schema';
import { NewsSectionSchema } from './schemas/newsSection.schema';
import { MdaModule } from '../mda/mda.module';
import { MiscClass } from 'src/common/services/misc.service';
import { AuthModule } from '../auth/auth.module';
import { UserSchema } from '../user/schemas/user.schema';
import { TagModule } from '../tag/tag.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'News', schema: NewsSchema },
      { name: 'NewsSection', schema: NewsSectionSchema },
      { name: 'User', schema: UserSchema },
    ]),
    MdaModule,
    AuthModule,
    TagModule
    // UserModule
  ],
  providers: [NewsService, MiscClass],
  controllers: [NewsController]
})
export class NewsModule {}
