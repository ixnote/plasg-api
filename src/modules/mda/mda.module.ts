import { Module } from '@nestjs/common';
import { MdaController } from './mda.controller';
import { MdaService } from './services/mda.service';
import { MongooseModule } from '@nestjs/mongoose';
import { MdaSchema } from './schemas/mda.schema';
import { MongooseService } from 'src/common/helpers/mongoose.helper';
import { UserModule } from '../user/user.module';
import { JwtService } from '@nestjs/jwt';
import { UserSchema } from '../user/schemas/user.schema';
import { ErrorSchema } from '../error/schemas/error.schema';
import { MiscClass } from 'src/common/services/misc.service';
import { CloudinaryModule } from 'src/common/services/cloudinary/cloudinary.module';
import { ResourceSchema } from '../resource/schemas/resource.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Mda', schema: MdaSchema },
      { name: 'User', schema: UserSchema },
      { name: 'Error', schema: ErrorSchema },
    ]),
    UserModule,
    CloudinaryModule,
  ],
  providers: [MdaService, MongooseService, JwtService, MiscClass],
  controllers: [MdaController],
  exports: [MdaService],
})
export class MdaModule {}
