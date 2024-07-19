import { Body, Controller, Get, HttpCode, Post, UseFilters, UseGuards } from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { ExceptionsLoggerFilter } from 'src/framework/exceptions/exceptionLogger.filter';
import { AuthService } from './services/auth.service';
import { User } from '../user/interfaces/user.interface';
import { AuthGuard } from 'src/framework/guards/auth.guard';
import { RolesGuard } from 'src/framework/guards/roles.guard';
import { UserRoles } from 'src/common/constants/enum';
import { Roles } from 'src/common/decorators/roles.decorator';
import { SignInDto } from './dtos/sign-in.dto';
import { UserGuard } from 'src/framework/guards/user.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/create')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRoles.SUPER)
  @UseFilters(ExceptionsLoggerFilter)
  async createUser(@Body() body: CreateUserDto) {
    const user: User = await this.authService.createUser(body);
    return {
      status: true,
      message: 'User created successfully.',
      data: user,
    };
  }

  @Post('login')
  @HttpCode(200)
  @UseFilters(ExceptionsLoggerFilter)
  async login(@Body()body: SignInDto){
    const tokens = await this.authService.signIn(body);
    return {
      status: true,
      message: 'Login successful',
      data: tokens,
    };
  }

  @Get('profile')
  @UseGuards(AuthGuard)
  @HttpCode(200)
  @UseFilters(ExceptionsLoggerFilter)
  async getProfile(@UserGuard() user: User){
    const profile: User = await this.authService.getProfile(user)
    return {
      status: true,
      message: 'Get User Profile',
      data: profile,
    };
  }
}
