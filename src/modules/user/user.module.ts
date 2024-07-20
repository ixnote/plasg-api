import { forwardRef, Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from './schemas/user.schema';
import { UserService } from './services/user.service';
import { MongooseService } from 'src/common/helpers/mongoose.helper';
import { AuthModule } from '../auth/auth.module';
import { ErrorModule } from '../error/error.module';
import { ErrorSchema } from '../error/schemas/error.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'User', schema: UserSchema },
      { name: 'Error', schema: ErrorSchema },
    ]),
    forwardRef(() => AuthModule),
    ErrorModule
  ],
  providers: [UserService, MongooseService],
  controllers: [UserController],
  exports: [UserService]
})
export class UserModule {}
