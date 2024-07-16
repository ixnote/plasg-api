import { Module } from '@nestjs/common';
import { ResourceController } from './resource.controller';
import { ResourceService } from './services/resource.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ResourceSchema } from './schemas/resource.schema';
import { MdaModule } from 'src/modules/mda/mda.module';
import { AuthModule } from 'src/modules/auth/auth.module';
import { UserSchema } from 'src/modules/user/schemas/user.schema';
import { TagModule } from '../tag/tag.module';
import { MiscClass } from 'src/common/services/misc.service';
import { CloudinaryModule } from 'src/common/services/cloudinary/cloudinary.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Resource', schema: ResourceSchema },
      { name: 'User', schema: UserSchema },
    ]),
    MdaModule,
    AuthModule,
    TagModule,
    CloudinaryModule
  ],
  controllers: [ResourceController],
  providers: [ResourceService, MiscClass]
})
export class ResourceModule {}
