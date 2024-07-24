import { Body, Controller, Get, Param, Patch, Post, Put, Query, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
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
import { UpdateResourceDto } from './dtos/update-resource.dto';

@Controller('resource')
export class ResourceController {
  constructor(private resourceService: ResourceService) {}

  @Post('/create')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRoles.MDA)
  async createResource(
    @Body() body: CreateResourceDto,
    @UserGuard() user: User,
  ) {
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

  @Patch('/update/:resourceId')
  @UseGuards(AuthGuard)
  @Roles(UserRoles.MDA)
  async updateResource(@Param() param: {resourceId: string}, @Body() body: UpdateResourceDto, @UserGuard() user: User){
    const resource: Resource = await this.resourceService.updateResource(param.resourceId, body, user)
    return {
      status: true,
      message: 'Resource updated successfully',
      data: resource,
    };
  }

  @Get('/mda')
  @UseGuards(AuthGuard)
  @Roles(UserRoles.MDA)
  async getResourcesForMda(@Query() query: GetResourcesDto, @UserGuard() user: User){
    const results = await this.resourceService.getResourcesForMda(query, user)
    return {
      status: true,
      message: 'Resources fetched successfully',
      data: results,
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

  @Get('/home-page')
  async findLatestResourcesByTag(){
    const results = await this.resourceService.findLatestResourcesByTag()
    return {
      status: true,
      message: 'Resources fetched successfully',
      data: results,
    };
  }
}
