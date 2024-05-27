import { forwardRef, Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from './schemas/user.schema';
import { UserService } from './services/user.service';
import { MongooseService } from 'src/common/helpers/mongoose.helper';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'User', schema: UserSchema },
    ]),
    forwardRef(() => AuthModule),
  ],
  providers: [UserService, MongooseService],
  controllers: [UserController],
  exports: [UserService]
})
export class UserModule {}
