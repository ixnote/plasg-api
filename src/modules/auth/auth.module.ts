import { forwardRef, Module } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from '../user/schemas/user.schema';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { ErrorSchema } from '../error/schemas/error.schema';

@Module({
  imports: [
    JwtModule.register({}),
    MongooseModule.forFeature([
      { name: 'User', schema: UserSchema },
      { name: 'Error', schema: ErrorSchema },
    ]),
    forwardRef(() => UserModule),
  ],
  providers: [AuthService, JwtService, ConfigService],
  controllers: [AuthController],
  exports: [JwtService]
})
export class AuthModule {}
