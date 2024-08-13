import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ProjectService } from './services/project.service';
import { RolesGuard } from 'src/framework/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { UserRoles } from 'src/common/constants/enum';
import { AddProjectDto } from './dtos/add-project.dto';
import { Project } from './interfaces/project.interface';
import { UserGuard } from 'src/framework/guards/user.guard';
import { User } from '../user/interfaces/user.interface';
import { GetProjectDto } from './dtos/get-project.dto';
import { UpdatedProjectDto } from './dtos/update-project.dto';
import { GetProjectsDto } from './dtos/get-projects.dto';
import { AuthGuard } from 'src/framework/guards/auth.guard';
import { query } from 'express';

@Controller('project')
export class ProjectController {
  constructor(private projectService: ProjectService) {}

  @Post('/add')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRoles.MDA)
  async addProject(@Body() body: AddProjectDto, @UserGuard() user: User) {
    const project: Project = await this.projectService.addProject(body, user);
    return {
      status: true,
      message: 'Project added successfully',
      project,
    };
  }

  @Put('/update/:projectId')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRoles.MDA)
  async updateProject(
    @Param() param: GetProjectDto,
    @Body() body: UpdatedProjectDto,
    @UserGuard() user: User,
  ) {
    const project: Project = await this.projectService.updateProject(
      body,
      param.projectId,
      user,
    );
    return {
      status: true,
      message: 'Project updated successfully',
      project,
    };
  }

  @Get('/admin/all')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRoles.SUPER)
  async getProjectsForAdmin(
    @Query() query: GetProjectsDto,
  ) {
    const results = await this.projectService.getProjectsForAdmin(query);
    return {
      status: true,
      message: 'Projects fetched successfully',
      results,
    };
  }

  @Get('/user/all')
  async getProjectsForUser(
    @Query() query: GetProjectsDto
  ) {
    const results = await this.projectService.getProjectsForUser(query);
    return {
      status: true,
      message: 'Projects fetched successfully',
      results,
    };
  }

  @Get('/mda/all')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRoles.MDA)
  async getProjectsForMda(
    @Query() query: GetProjectsDto,
    @UserGuard() user: User,
  ) {
    const results = await this.projectService.getProjectsForMda(query, user);
    return {
      status: true,
      message: 'Projects fetched successfully',
      results,
    };
  }

  @Get('/mda/:projectId')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRoles.MDA)
  async getProjectForMda(
    @Param() param: GetProjectDto,
    @UserGuard() user: User,
  ) {
    const project: Project = await this.projectService.getProjectForMda(
      param,
      user,
    );
    return {
      status: true,
      message: 'Project fetched successfully',
      project,
    };
  }

  @Get('/admin/:projectId')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRoles.SUPER)
  async getProjectForAdmin(
    @Param() param: GetProjectDto,
  ) {
    const project: Project = await this.projectService.getProjectForAdmin(
      param,
    );
    return {
      status: true,
      message: 'Project fetched successfully',
      project,
    };
  }

  @Get('/user/:projectId')
  async getProjectForUser(@Param() param: GetProjectDto) {
    const project: Project = await this.projectService.getProjectForUser(param);
    return {
      status: true,
      message: 'Project fetched successfully',
      project,
    };
  }

  @Delete('/:projectId')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRoles.MDA)
  async deleteProject(@Param() param: GetProjectDto, @UserGuard() user: User){
    await this.projectService.deleteProject(param, user);
    return {
      status: true,
      message: 'Project deleted successfully'
    };
  }


}
