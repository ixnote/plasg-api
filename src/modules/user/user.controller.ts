import {
  Body,
  Controller,
  Get,
  Patch,
  Query,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { UserRoles } from 'src/common/constants/enum';
import { Roles } from 'src/common/decorators/roles.decorator';
import { AuthGuard } from 'src/framework/guards/auth.guard';
import { RolesGuard } from 'src/framework/guards/roles.guard';
import { UserService } from './services/user.service';
import { User } from './interfaces/user.interface';
import { ExceptionsLoggerFilter } from 'src/framework/exceptions/exceptionLogger.filter';
import { UpdatePassword } from './dtos/update-password.dto';
import { UserGuard } from 'src/framework/guards/user.guard';
import { GetUsersDto } from './dtos/get-users.dto';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('/')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRoles.SUPER)
  async getUsers(@Query() query: GetUsersDto) {
    const users: User[] = await this.userService.getMdaUsers(query);
    return {
      status: true,
      message: 'Users fetched successfully',
      data: users,
    };
  }

  @Patch('/update-password')
  @UseGuards(AuthGuard)
  @UseFilters(ExceptionsLoggerFilter)
  async updatePassword(@Body() body: UpdatePassword, @UserGuard() user: User) {
    await this.userService.updatePassword(body, user);
    return {
      status: true,
      message: 'Password updated successfully',
    };
  }
}
