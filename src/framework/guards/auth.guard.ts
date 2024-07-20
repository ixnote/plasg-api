import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Request } from 'express';
import { Model } from 'mongoose';
import { User } from 'src/modules/user/interfaces/user.interface';
import { env } from 'src/common/config/env.config';
const { JWT_ACCESS_SECRET } = env;

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    @InjectModel('User') private readonly userModel: Model<User>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException({
        status: false,
        message: 'No token provided',
      });
    }
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: JWT_ACCESS_SECRET,
      });
      if (!payload)
        throw new UnauthorizedException({
          status: false,
          message: 'Please Login',
        });
      const user: User = await this.userModel.findById(payload.sub);
      const url: string = request.protocol + '://' + request.get('host') + request.originalUrl;
      const urlArray: string[] = url.split('/')
   if(!(urlArray[urlArray.length - 1] == "update-password")){
        if (!user.password_updated) throw new UnauthorizedException({
          status: false,
          message: "Please update your password to continue"
        })
      }
      if (!user || user.is_suspended || user.is_deleted)
        throw new UnauthorizedException();
      request['user'] = user;
    } catch (err) {
      throw new UnauthorizedException({
        status: false,
        message: err.message == 'jwt expired' ? 'Please Login' : err.message,
      });
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
