import { Module } from '@nestjs/common';
import { StaticsController } from './statics.controller';
import { StaticsService } from './services/statics.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from 'src/modules/user/user.module';
import { DestinationSchema } from './schemas/destination.schema';
import { MdaSchema } from 'src/modules/mda/schemas/mda.schema';
import { ErrorSchema } from 'src/modules/error/schemas/error.schema';
import { LegislativeSchema } from './schemas/legislative.schema';
import { MiscClass } from 'src/common/services/misc.service';
import { CloudinaryModule } from 'src/common/services/cloudinary/cloudinary.module';
import { AuthModule } from 'src/modules/auth/auth.module';
import { UserSchema } from 'src/modules/user/schemas/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Destination', schema: DestinationSchema },
      { name: 'Legislative', schema: LegislativeSchema },
      { name: 'User', schema: UserSchema },
      { name: 'Error', schema: ErrorSchema },
    ]),
    UserModule,
    CloudinaryModule,
    AuthModule
  ],
  controllers: [StaticsController],
  providers: [StaticsService, MiscClass],
  exports: [StaticsService]
})
export class StaticsModule {}
