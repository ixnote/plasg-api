import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
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
import { UserGuard } from 'src/framework/guards/user.guard';
import { User } from '../user/interfaces/user.interface';
import { UpdateGovernmentOfficialDto } from './dtos/update-government-officaial.dto';
import { AddGovernmentOfficialDto } from './dtos/add-governement-official.dto';
import { GlobalSearchPaginationDto } from './dtos/global-search.dto';
import { query } from 'express';
import { Government } from './interfaces/government.interface';
import { GetGovernmentDto } from './dtos/get-government.dto';
import { GetGovernmentsDto } from './dtos/get-governments.dto';

@Controller('statics')
export class StaticsController {
  constructor(private staticsService: StaticsService) {}

  @Get('/admin/dashboard')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRoles.SUPER)
  async superAdminDashboard() {
    const results = await this.staticsService.adminDashboard();
    return {
      status: true,
      message: 'Results fetched successfully',
      results,
    };
  }

  @Get('/global-search')
  async globalSearch(@Query() query: GlobalSearchPaginationDto){
    const results = await this.staticsService.globalSearch(query)
    return {
      status: true,
      message: 'Results fetched successfully',
      results,
    };
  }

  @Get('/mda/dashboard')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRoles.MDA)
  async mdaAdminDashboard(@UserGuard() user: User) {
    const results = await this.staticsService.mdaDashboard(user);
    return {
      status: true,
      message: 'Results fetched successfully',
      results,
    };
  }

  // Legislative
  @Post('/legislatives/add')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRoles.SUPER)
  async addLegislative(@Body() body: AddLegislativeDto) {
    const legislative: Legislative = await this.staticsService.addLegislative(
      body,
    );
    return {
      status: true,
      message: 'Legislative added successfully',
      data: legislative,
    };
  }

  @Post('/government/add')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRoles.SUPER)
  async addGovernment(@Body() body: AddGovernmentOfficialDto) {
    const government: Government =
      await this.staticsService.addGovernment(body);
    return {
      status: true,
      message: 'Government official added successfully',
      data: government,
    };
  }

  @Get('/government/active')
  async getActiveGovernment() {
    const government: Government =
      await this.staticsService.getActiveGovernment();
    return {
      status: true,
      message: 'Active government fetched successfully',
      data: government,
    };
  }

  @Put('/government/:governmentId')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRoles.SUPER)
  async updateGovernment(
    @Param() param: GetGovernmentDto,
    @Body() body: UpdateGovernmentOfficialDto,
  ) {
    const government: Government =
      await this.staticsService.updateGovernment(param, body);
    return {
      status: true,
      message: 'Government updated successfully',
      data: government
    };
  }

  @Get('/government/:governmentId')
  async getGovernmentOfficial(@Param() param: GetGovernmentDto) {
    const government: Government =
      await this.staticsService.getGovernment(param);
    return {
      status: true,
      message: 'Government official fetched successfully',
      data: government,
    };
  }


  @Get('/governments')
  async getGovernments(@Query() query: GetGovernmentsDto) {
    const governments: Government[] =
      await this.staticsService.getGovernments(query);
    return {
      status: true,
      message: 'List of governments fetched successfully',
      data: governments,
    };
  }

  @Delete('/legislatives/:legislativeId')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRoles.SUPER)
  async deleteLegislative(@Param() param: GetLegislativeDto) {
    await this.staticsService.deleteLegislative(param);
    return {
      status: true,
      message: 'Legislative deleted successfully',
    };
  }

  @Get('/legislatives')
  async getLegislatives(@Query() query: GetLegislativesDto) {
    const result = await this.staticsService.getLegislatives(query);
    return {
      status: true,
      message: 'Legislatives fetched successfully',
      data: result,
    };
  }

  // @Get('/governor-cabinet')
  // async getGovernorsCabinet(@Query() query: GetLegislativesDto){
  //     const result = await this.staticsService.getGovernorsCabinet(query)
  //     return {
  //         status: true,
  //         message: "Legislatives fetched successfully",
  //         data: result
  //     }
  // }

  @Get('/legislatives/:legislativeId')
  async getLegislative(@Param() param: GetLegislativeDto) {
    const legislative: Legislative = await this.staticsService.getLegislative(
      param,
    );
    return {
      status: true,
      message: 'Legislative fetched successfully',
      data: legislative,
    };
  }

  @Post('/destinations/add')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRoles.SUPER)
  @UseInterceptors(FileInterceptor('file'))
  async addDestination(
    @Body() body: AddDestinationDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (file) {
      body.file = file;
    }
    const destination: Destination = await this.staticsService.addDestination(
      body,
    );
    return {
      status: true,
      message: 'Destination added successfully',
      data: destination,
    };
  }

  // Destinations
  @Delete('/destinations/:destinationId')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRoles.SUPER)
  async deleteDestination(@Param() param: GetDestinationDto) {
    await this.staticsService.deleteDestination(param);
    return {
      status: true,
      message: 'Destination deleted successfully',
    };
  }

  @Get('/destinations')
  async getDestinations(@Query() query: GetDestinationsDto) {
    const result = await this.staticsService.getDestinations(query);
    return {
      status: true,
      message: 'Destinations fetched successfully',
      data: result,
    };
  }

  @Get('/destinations/:destinationId')
  async getDestination(@Param() param: GetDestinationDto) {
    const destination: Destination = await this.staticsService.getDestination(
      param,
    );
    return {
      status: true,
      message: 'Destination fetched successfully',
      data: destination,
    };
  }
}
