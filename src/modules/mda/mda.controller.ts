import { Body, Controller, Delete, Param, Post, Put, UseFilters, UseGuards } from '@nestjs/common';
import { MdaService } from './services/mda.service';
import { Mda } from './interfaces/mda.interface';
import { CreateMdaDto } from './dtos/create-mda.dto';
import { AuthGuard } from 'src/framework/guards/auth.guard';
import { RolesGuard } from 'src/framework/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { UserRoles } from 'src/common/constants/enum';
import { ExceptionsLoggerFilter } from 'src/framework/exceptions/exceptionLogger.filter';
import { AssignMdaDto } from './dtos/assign-mda.dto';
import { RemoveMdaDto } from './dtos/remove-mda.dto';

@Controller('mda')
export class MdaController {
    constructor(
        private mdaService: MdaService
    ){}

    @Post('/add')
    @UseGuards(AuthGuard, RolesGuard)
    @Roles(UserRoles.SUPER)
    @UseFilters(ExceptionsLoggerFilter)
    async addMda(@Body() body: CreateMdaDto){
        const mda: Mda = await this.mdaService.createMda(body);
        return {
            status: true,
            message: "Mda added successfully.",
            data: mda
        }
    }

    @Put("/assign/:mda/:admin")
    @UseGuards(AuthGuard, RolesGuard)
    @Roles(UserRoles.SUPER)
    @UseFilters(ExceptionsLoggerFilter)
    async assignAdmin(@Param() param: AssignMdaDto){
        const message: string = await this.mdaService.assignAdminToMda(param)
        return {
            status: true,
            message
        }
    }

    @Put("/unassign/:mda")
    async removeAdmin(@Param() param: RemoveMdaDto){
        const message: string = await this.mdaService.removeUserFromMda(param)
        return {
            status: true,
            message
        }
    }
}
