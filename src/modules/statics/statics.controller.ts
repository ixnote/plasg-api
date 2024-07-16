import { Body, Controller, Delete, Get, Param, Post, Query, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { UserRoles } from 'src/common/constants/enum';
import { Roles } from 'src/common/decorators/roles.decorator';
import { AuthGuard } from 'src/framework/guards/auth.guard';
import { RolesGuard } from 'src/framework/guards/roles.guard';
import { Legislative } from './interfaces/legislative.interface';
import { StaticsService } from './services/statics.service';
import { AddLegislativeDto } from './dtos/add-legislative.dto';
import { GetLegislativeDto } from './dtos/get-legislative.dto';
import { GetLegislativesDto } from './dtos/get-legislatives.dto';
import { AddDestinationDto } from './dtos/add-destination.dto';
import { Destination } from './interfaces/destination.interface';
import { GetDestinationDto } from './dtos/get-destination.dto';
import { GetDestinationsDto } from './dtos/get-destinations.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('statics')
export class StaticsController {

    constructor(
        private staticsService: StaticsService
    ){}

    // Legislative
    @Post('/legislatives/add')
    @UseGuards(AuthGuard, RolesGuard)
    @Roles(UserRoles.SUPER)
    @UseInterceptors(FileInterceptor('file'))
    async addLegislative(@Body() body: AddLegislativeDto,  @UploadedFile() file: Express.Multer.File){
        if(file){
            body.file = file
        }
        const legislative: Legislative = await this.staticsService.addLegislative(body)
        return {
            status: true,
            message: "Legislative added successfully",
            data: legislative
        }
    }

    @Delete('/legislatives/:legislativeId')
    @UseGuards(AuthGuard, RolesGuard)
    @Roles(UserRoles.SUPER)
    async deleteLegislative(@Param() param: GetLegislativeDto){
        await this.staticsService.deleteLegislative(param)
        return {
            status: true,
            message: "Legislative deleted successfully",
        }
    }

    @Get('/legislatives')
    async getLegislatives(@Query() query: GetLegislativesDto){
        const result = await this.staticsService.getLegislatives(query)
        return {
            status: true,
            message: "Legislatives fetched successfully",
            data: result
        }
    }

    @Get('/legislatives/:legislativeId')
    async getLegislative(@Param() param: GetLegislativeDto){
        const legislative: Legislative = await this.staticsService.getLegislative(param)
        return {
            status: true,
            message: "Legislative fetched successfully",
            data: legislative
        } 
    }


    @Post('/destinations/add')
    @UseGuards(AuthGuard, RolesGuard)
    @Roles(UserRoles.SUPER)
    @UseInterceptors(FileInterceptor('file'))
    async addDestination(@Body() body: AddDestinationDto,  @UploadedFile() file: Express.Multer.File,){
        if(file){
            body.file = file
        }
        const destination:  Destination= await this.staticsService.addDestination(body)
        return {
            status: true,
            message: "Destination added successfully",
            data: destination
        }
    }

    // Destinations
    @Delete('/destinations/:destinationId')
    @UseGuards(AuthGuard, RolesGuard)
    @Roles(UserRoles.SUPER)
    async deleteDestination(@Param() param: GetDestinationDto){
        await this.staticsService.deleteDestination(param)
        return {
            status: true,
            message: "Destination deleted successfully",
        }
    }

    @Get('/destinations')
    async getDestinations(@Query() query: GetDestinationsDto){
        const result = await this.staticsService.getDestinations(query)
        return {
            status: true,
            message: "Destinations fetched successfully",
            data: result
        }
    }

    @Get('/destinations/:destinationId')
    async getDestination(@Param() param: GetDestinationDto){
        const destination: Destination = await this.staticsService.getDestination(param)
        return {
            status: true,
            message: "Destination fetched successfully",
            data: destination
        } 
    }
}
