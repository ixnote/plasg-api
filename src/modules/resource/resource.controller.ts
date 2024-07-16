import { Body, Controller, Get, Param, Post, Query, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { ResourceService } from './services/resource.service';
import { CreateResourceDto } from './dtos/create-resource.dto';
import { Resource } from './interfaces/resource.interface';
import { UserGuard } from 'src/framework/guards/user.guard';
import { User } from 'src/modules/user/interfaces/user.interface';
import { RolesGuard } from 'src/framework/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { UserRoles } from 'src/common/constants/enum';
import { AuthGuard } from 'src/framework/guards/auth.guard';
import { SearchResourcesDto } from './dtos/search-resource.dto';
import { GetResourceDto } from './dtos/get-resource.dto';
import { query } from 'express';
import { GetResourcesDto } from './dtos/get-resources.dto';
import { GetResourcesByNameDto } from './dtos/get-resources-by-name.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('resource')
export class ResourceController {
  constructor(private resourceService: ResourceService) {}

  @Post('/create')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRoles.MDA)
  @UseInterceptors(FileInterceptor('file'))
  async createResource(
    @Body() body: CreateResourceDto,
    @UserGuard() user: User,
    @UploadedFile() file: Express.Multer.File
  ) {
    if(file){
      body.file = file
  }
    const resource: Resource = await this.resourceService.createResource(
      body,
      user,
    );
    return {
      status: true,
      message: 'Resource created successfully',
      data: resource,
    };
  }

  @Get('/search/:name')
  async searchResources(@Param() param: {name: string}, @Query() query: SearchResourcesDto) {
    const resources = await this.resourceService.searchResources(param, query);
    return {
      status: true,
      message: 'Resources fetched successfully',
      data: resources,
    };
  }

  @Get('/single/:resourceId')
  async getResourceById(@Param() param: GetResourceDto) {
    const resource: Resource = await this.resourceService.getResourceById(param);
    return {
      status: true,
      message: 'Resource fetched successfully',
      data: resource,
    };
  }

  @Get('/all')
  async getResources(@Query() query: GetResourcesDto) {
    const resources: Resource [] = await this.resourceService.getResources(query)
    return {
        status: true,
        message: 'Resources fetched successfully',
        data: resources,
      };
  }

  @Get('/category/:name')
  async getResourcesByCategory(@Param() param: {name: string}, @Query() query: GetResourcesByNameDto){
    const results = await this.resourceService.getResourcesByCategory(param.name, query)
    return {
      status: true,
      message: 'Resources fetched successfully',
      data: results,
    };
  }
}
