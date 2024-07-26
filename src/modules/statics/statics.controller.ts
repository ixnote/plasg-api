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
import { GlobalSearchDto } from './dtos/global-search.dto';

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

  @Get('/global-search/:description')
  async globalSearch(@Param() param: GlobalSearchDto){
    const results = await this.staticsService.globalSearch(param.description)
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
  async addGovernmentOfficial(@Body() body: AddGovernmentOfficialDto) {
    const legislative: Legislative =
      await this.staticsService.addGovernmentOfficial(body);
    return {
      status: true,
      message: 'Government official added successfully',
      data: legislative,
    };
  }

  @Get('/government/active')
  async getActiveGovernment() {
    const government: Legislative =
      await this.staticsService.getActiveGovernment();
    return {
      status: true,
      message: 'Active government fetched successfully',
      data: government,
    };
  }

  @Put('/government/:legislativeId')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRoles.SUPER)
  async updateGovernmentOfficial(
    @Param() param: GetLegislativeDto,
    @Body() body: UpdateGovernmentOfficialDto,
  ) {
    const legislative: Legislative =
      await this.staticsService.updateGovernment(param, body);
    return {
      status: true,
      message: 'Government official updated successfully',
      data: legislative,
    };
  }

  @Get('/government/:legislativeId')
  async getGovernmentOfficial(@Param() param: GetLegislativeDto) {
    const legislative: Legislative =
      await this.staticsService.getGovernmentOfficial(param);
    return {
      status: true,
      message: 'Government official fetched successfully',
      data: legislative,
    };
  }


  @Get('/governments')
  async getGovernmentOfficials(@Query() query: GetLegislativesDto) {
    const governments: Legislative[] =
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
