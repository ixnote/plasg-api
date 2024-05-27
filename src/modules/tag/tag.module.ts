import { Module } from '@nestjs/common';
import { TagController } from './tag.controller';
import { TagService } from './services/tag.service';
import { TagSchema } from './schemas/tag.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from 'src/modules/auth/auth.module';
import { UserSchema } from 'src/modules/user/schemas/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Tag', schema: TagSchema },
      { name: 'User', schema: UserSchema },
    ]),
    AuthModule
  ],
  controllers: [TagController],
  providers: [TagService],
  exports: [TagService]
})
export class TagModule {}
