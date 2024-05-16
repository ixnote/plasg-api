import { Request } from 'express';
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  BadRequestException,
} from '@nestjs/common';
import { env } from 'src/common/config/env.config';
const { PLATEAU_KEY } = env;

@Injectable()
export class PlateauGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req: Request = context.switchToHttp().getRequest();

    const spikkAppKey = req.headers['x-app-plateau-key'] || '';

    if (spikkAppKey !== PLATEAU_KEY) {
      throw new BadRequestException('Unknown Request!');
    }

    return true;
  }
}
