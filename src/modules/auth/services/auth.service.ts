import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';

import { JwtService } from '@nestjs/jwt';

import { UserService } from 'src/modules/user/services/user.service';
import { User } from 'src/modules/user/interfaces/user.interface';
import { CreateUserDto } from '../dtos/create-user.dto';
import { SignInDto } from '../dtos/sign-in.dto';
import { env } from 'src/common/config/env.config';
import * as argon2 from 'argon2';
import { ResetPasswordDto } from '../dtos/reset-password.dto';
import { AuthOtpType, TokenTimeout } from '../constants/auth.constants';
import { MailService } from 'src/modules/mail/mail.service';
import { UpdatePasswordDto } from '../dtos/update-password.dto';

const { JWT_REFRESH_SECRET, JWT_ACCESS_SECRET } = env;

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private mailService: MailService,
    private jwtService: JwtService,
  ) {}

  async createUser(body: CreateUserDto): Promise<User> {
    return await this.userService.registerUser(body);
  }

  async getProfile(user: User): Promise<User> {
    return await this.userService.findByEmail(user.email);
  }

  async signIn(data: SignInDto) {
    const user: User = await this.userService.findPasswordByEmail(data.email);
    console.log('🚀 ~ AuthService ~ signIn ~ user:', user);
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
    await this.updateRefreshToken(user._id, tokens.refreshToken);
    const findUser: User = await this.userService.findById(user.id);
    this.mailService.sendLoginEmail(findUser);
    const first_time_login = user.password_updated ? false : true;
    return { first_time_login, tokens, role: user.role };
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

  async changePassword(body: {
    user: User;
    password: string;
    newPassword: string;
  }): Promise<string> {
    const { user, password, newPassword } = body;
    const findUser: User = await this.userService.findPasswordByEmail(
      user.email,
    );
    const passwordMatches = await argon2.verify(findUser.password, password);
    if (!passwordMatches)
      throw new BadRequestException({
        status: false,
        message: 'Password is incorrect',
      });
    const hash = await this.hashData(newPassword);
    await this.userService.update(user.id, {
      password: hash,
      password_updated: true,
    });
    return 'Password changed successfully';
  }

  async resetPassword(body: ResetPasswordDto): Promise<string> {
    const user: User = await this.userService.findByEmailWithOtp(body.email);
    if (!user)
      throw new BadRequestException({
        status: false,
        message: 'Account does not exist',
      });
    const now = new Date();
    if (user.otp.token !== body.otp || user.otp.expirationTime < now)
      throw new UnauthorizedException({
        status: false,
        message: 'Invalid token',
      });
    const hashedPassword: string = await this.hashData(body?.password);
    await this.userService.update(user.id, {
      password: hashedPassword,
    });
    return 'Password updated successfully.';
  }

  async userForgotPassword(email: string): Promise<string> {
    const user: User = await this.userService.findByEmail(email);
    if (!user)
      throw new BadRequestException({
        status: false,
        message: 'Account does not exist',
      });
    const otp: string = await this.makeOtp({
      identifier: user?.id,
      type: AuthOtpType.VERIFICATION,
      timeout: TokenTimeout.ONE_HOUR,
    });

    const expirationTime: number = Date.now() + TokenTimeout.ONE_HOUR * 1000;
    const expirationDate: Date = new Date(expirationTime);
    await this.userService.update(user.id, {
      otp: {
        token: otp,
        expirationTime: expirationDate,
      },
    });
    this.mailService.sendResetPasswordEmail(user, otp).catch((err) => {
      console.error('Error sending email:', err);
    });
    return 'Please check your email to continue.';
  }

  async updatePasswordForAdmin(body: UpdatePasswordDto): Promise<string> {
    const user: User = await this.userService.findByEmailWithOtp(body.email);
    if (!user)
      throw new BadRequestException({
        status: false,
        message: 'Account does not exist',
      });
    const hashedPassword: string = await this.hashData(body?.password);
    await this.userService.update(user.id, {
      password: hashedPassword,
      password_updated: true,
    });
    this.mailService.updatePasswordEmail(user, body.password).catch((err) => {
      console.error('Error sending email:', err);
    });
    return 'Password updated successfully.';
  }

  async makeOtp(data: {
    identifier: string;
    type: AuthOtpType;
    timeout: TokenTimeout;
  }): Promise<string> {
    const otp: string = this.generateNumericToken(6);
    const expirationTime: number = Date.now() + data?.timeout * 1000;
    const date: Date = new Date(expirationTime);
    const user: User = await this.userService.update(data.identifier, {
      otp: {
        token: otp,
        expirationTime: date,
      },
    });
    if (!user?.otp?.token)
      throw new InternalServerErrorException({
        status: false,
        message: 'Something went wrong generating otp!',
      });
    return otp;
  }

  private generateNumericToken(length: number): string {
    let token = '';
    while (token.length !== length) {
      const max = Number(`1${'0'.repeat(length)}`) - 1;
      token = `${Math.floor(Math.random() * max)}`;
    }
    return token;
  }
}
