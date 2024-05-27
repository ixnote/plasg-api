import { Controller, Get, UseGuards } from '@nestjs/common';
import { UserRoles } from 'src/common/constants/enum';
import { Roles } from 'src/common/decorators/roles.decorator';
import { AuthGuard } from 'src/framework/guards/auth.guard';
import { RolesGuard } from 'src/framework/guards/roles.guard';
import { UserService } from './services/user.service';
import { User } from './interfaces/user.interface';

@Controller('user')
export class UserController {
    constructor(
        private userService: UserService
    ){}
    
    @Get('/')
    @UseGuards(AuthGuard, RolesGuard)
    @Roles(UserRoles.SUPER)
    async getUsers(){
        const users: User[] = await this.userService.getMdaUsers();
        return {
            status: true,
            message: "Users fetched successfully",
            data: users
        }
    }
}
