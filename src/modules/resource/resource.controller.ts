import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
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

@Controller('resource')
export class ResourceController {
    constructor(
        private resourceService: ResourceService
    ){}

    @Post("/create")
    @UseGuards(AuthGuard, RolesGuard)
    @Roles(UserRoles.MDA)
    async createResource(@Body() body: CreateResourceDto, @UserGuard() user: User){
        const resource: Resource = await this.resourceService.createResource(body, user);
        return {
            status: true,
            message: "Resource created successfully",
            data: resource
        }
    }

    @Get("/")
    async searchResources(@Query() query: SearchResourcesDto){
        const resources = await this.resourceService.searchResources(query)
        return {
            status: true,
            message: "Resources fetched successfully",
            data: resources
        }
    }

    @Get("/all")
    async getResources(){
       
    }   
}
