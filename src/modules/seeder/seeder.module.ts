import { Module } from '@nestjs/common';
import { SeederService } from './seeder.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from '../user/schemas/user.schema';
import { TagModule } from '../tag/tag.module';
import { MdaModule } from '../mda/mda.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'User', schema: UserSchema },
    ]),
    TagModule,
    MdaModule
  ],
  providers: [SeederService],
  exports: [SeederService],
})
export class SeederModule {}
