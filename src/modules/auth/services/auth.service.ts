import { BadRequestException, Injectable } from '@nestjs/common';

import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UserService } from 'src/modules/user/services/user.service';
import { User } from 'src/modules/user/interfaces/user.interface';
import { CreateUserDto } from '../dtos/create-user.dto';
import { SignInDto } from '../dtos/sign-in.dto';
import { env } from 'src/common/config/env.config';
import * as argon2 from 'argon2';

const { JWT_REFRESH_SECRET, JWT_ACCESS_SECRET } = env;

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private configService: ConfigService,
    private jwtService: JwtService,
  ) {}

  async createUser(body: CreateUserDto): Promise<User> {
    return await this.userService.registerUser(body);
  }

  async signIn(data: SignInDto) {
    const user: User = await this.userService.findPasswordByEmail(data.email);
    if (!user)
      throw new BadRequestException({
        status: false,
        message: 'User does not exist',
      });
    const passwordMatches = await argon2.verify(user.password, data.password);
    if (!passwordMatches)
      throw new BadRequestException({
        status: false,
        message: 'Password is incorrect',
      });
    const tokens = await this.getTokens(user._id, user.email);
    console.log("🚀 ~ AuthService ~ signIn ~ passwordMatches:", passwordMatches)
    
    await this.updateRefreshToken(user._id, tokens.refreshToken);
    // const findUser: User = await this.userService.findById(user.id);
    // this.mailService.sendLoginEmail(findUser)
   
    return { tokens, role: user.role };
  }

  async updateRefreshToken(userId: string, refreshToken: string) {
    const hashedRefreshToken = await this.hashData(refreshToken);
    await this.userService.update(userId, {
      refreshToken: hashedRefreshToken,
    });
  }

  hashData(data: string) {
    return argon2.hash(data);
  }

  async getTokens(userId: string, email: string) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: userId,
          email,
        },
        {
          secret: JWT_ACCESS_SECRET,
          expiresIn: '1h',
        },
      ),
      this.jwtService.signAsync(
        {
          sub: userId,
          email,
        },
        {
          secret: JWT_REFRESH_SECRET,
          expiresIn: '7d',
        },
      ),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }
}
