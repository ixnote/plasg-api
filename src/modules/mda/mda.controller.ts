import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Query, UploadedFiles, UseFilters, UseGuards, UseInterceptors } from '@nestjs/common';
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
import { GetMdaDto } from './dtos/get-mda.dto';
import { MdaPaginationDto } from './dtos/mda-pagination.dto';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { ApiConsumes } from '@nestjs/swagger';
import { UpdateMdaDto } from './dtos/update-mda.dto';
import { AddTeamMembersDto } from './dtos/add-team.dto';
import { GetTeamDto } from './dtos/get-team.dto';
import { GetMdaBySlugDto } from './dtos/get-mda-by-slug.dto';

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

    @Patch('/update/:mdaId')
    @UseGuards(AuthGuard, RolesGuard)
    @Roles(UserRoles.SUPER)
    @UseFilters(ExceptionsLoggerFilter)
    async updateMda(@Body() body: UpdateMdaDto, @Param() param: GetMdaDto){
        const mda: Mda = await this.mdaService.updateMda(param, body);
        return {
            status: true,
            message: "Mda updated successfully.",
            data: mda
        }
    }

    @Get("/assign/:mda/:admin")
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

    @Get("/unassign/:mda")
    async removeAdmin(@Param() param: RemoveMdaDto){
        const message: string = await this.mdaService.removeUserFromMda(param)
        return {
            status: true,
            message
        }
    }

    @Get('/')
    async getMdas(@Query() query: MdaPaginationDto){
        const mdas: Mda[] = await this.mdaService.fetchMdas(query);
        return {
            status: true,
            message: "Mdas fetched successfully",
            data: mdas
        }
    }

    @Get('/admin')
    async getMdasAdmin(@Query() query: MdaPaginationDto){
        const mdas: Mda[] = await this.mdaService.fetchMdasAdmin(query);
        return {
            status: true,
            message: "Mdas fetched successfully",
            data: mdas
        }
    }

    @Get('/single/:mdaId')
    async getMda(@Param() param: GetMdaDto){
        const mda: Mda = await this.mdaService.getMda(param);
        return {
            status: true,
            message: "Mda fetched successfully",
            data: mda
        }
    }

    @Get('/slug/:slug')
    async getMdaBySlug(@Param() param: GetMdaBySlugDto){
        const mda: Mda = await this.mdaService.getMdaBySlug(param);
        return {
            status: true,
            message: "Mda fetched successfully",
            data: mda
        }
    }

    @Put('/admin/team-member/:mdaId')
    @UseGuards(AuthGuard)
    async addMdaTeamMember(@Param() param: GetMdaDto, @Body() body: AddTeamMembersDto){
        const mda: Mda = await this.mdaService.addMdaTeamMember(param, body)
        return {
            status: true,
            message: "Mda updated successfully",
            data: mda
        }
    }

    @Delete('/admin/team-member/:mdaId/:name')
    @UseGuards(AuthGuard)
    async removeMdaTeamMember(@Param() param: GetTeamDto){
        const mda: Mda = await this.mdaService.removeMdaTeamMember(param)
        return {
            status: true,
            message: "Mda updated successfully",
            data: mda
        }
    }
}
