import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { Project } from '../interfaces/Project.interface';
import { AddProjectDto } from '../dtos/add-project.dto';
import { MdaService } from 'src/modules/mda/services/mda.service';
import { MiscClass } from 'src/common/services/misc.service';
import { User } from 'src/modules/user/interfaces/user.interface';
import { Mda } from 'src/modules/mda/interfaces/mda.interface';
import { UpdatedProjectDto } from '../dtos/update-project.dto';
import { GetProjectDto } from '../dtos/get-project.dto';
import { GetProjectsDto } from '../dtos/get-projects.dto';
import { GetProjectsAdminDto } from '../dtos/get-projects-admin.dto';

@Injectable()
export class ProjectService {
  constructor(
    @InjectModel('Project') private projectModel: Model<Project>,
    private mdaService: MdaService,
    private miscService: MiscClass,
  ) {}

  async create(name: string, mda: string): Promise<Project> {
    const createdProject = new this.projectModel({ name, mda });
    return createdProject.save();
  }

  async findAll(): Promise<Project[]> {
    return this.projectModel.find().exec();
  }

  async findById(id: string): Promise<Project> {
    return this.projectModel.findById(id).populate('mda');
  }

  async findByIdAndMda(projectId: string, mdaId: string): Promise<Project> {
    const project = new mongoose.Types.ObjectId(projectId);
    const mda = new mongoose.Types.ObjectId(mdaId);
    const getProject: Project = await this.projectModel
      .findOne({
        _id: project,
        mda,
        is_deleted: false
      })
      .populate('mda', 'name logo');
    if (!getProject || getProject?.is_deleted)
      throw new NotFoundException({
        status: false,
        message: 'Project not found',
      });
    return getProject;
  }

  async findBySlug(slug: string): Promise<Project> {
    return await this.projectModel
      .findOne({ slug })
      .populate('mda', 'name logo');
  }

  async findByName(name: string): Promise<Project> {
    return this.projectModel.findOne({ name }).exec();
  }

  async addProject(body: AddProjectDto, user: User): Promise<Project> {
    const mda: Mda = await this.mdaService.findByUser(user.id);
    if (!mda)
      throw new NotFoundException({
        status: false,
        message: 'You are not appointed to an mda',
      });
    return await this.create(body.name, mda.id);
  }

  async updateProject(
    body: UpdatedProjectDto,
    projectId: string,
    user: User,
  ): Promise<Project> {
    const mda: Mda = await this.mdaService.findByUser(user.id);
    if (!mda)
      throw new NotFoundException({
        status: false,
        message: 'You are not appointed to an mda',
      });
    const project: Project = await this.findByIdAndMda(projectId, mda.id);
    return await this.projectModel.findByIdAndUpdate(project.id, body, {
      new: true,
    });
  }

  async deleteProject(body: GetProjectDto, user: User): Promise<void> {
    const mda: Mda = await this.mdaService.findByUser(user.id);
    if (!mda)
      throw new NotFoundException({
        status: false,
        message: 'You are not appointed to an mda',
      });
    const project: Project = await this.findByIdAndMda(body.projectId, mda.id);
    return await this.projectModel.findByIdAndUpdate(project.id, {
      is_deleted: true,
    });
  }

  async getProjectForMda(body: GetProjectDto, user: User): Promise<Project> {
    const mda: Mda = await this.mdaService.findByUser(user.id);
    if (!mda)
      throw new NotFoundException({
        status: false,
        message: 'You are not appointed to an mda',
      });
    return await this.findByIdAndMda(body.projectId, mda.id);
  }

  async getProjectForUser(body: GetProjectDto): Promise<Project> {
    const project: Project = await this.findById(body.projectId);
    if (!project || project?.is_deleted)
      throw new NotFoundException({
        status: false,
        message: 'Project not found',
      });
    return project;
  }

  async getProjectForAdmin(body: GetProjectDto): Promise<Project> {
    const project: Project = await this.findById(body.projectId);
    if (!project || project?.is_deleted)
      throw new NotFoundException({
        status: false,
        message: 'Project not found',
      });
    return project;
  }

  async getProjectsForMda(body: GetProjectsDto, user: User): Promise<any> {
    const { page = 1, pageSize = 10, sort = -1, name, ...rest } = body;
    const mda: Mda = await this.mdaService.findByUser(user.id);
    if (!mda)
      throw new NotFoundException({
        status: false,
        message: 'You are not appointed to an mda',
      });
    const usePage: number = body.page < 1 ? 1 : body.page;
    const pagination = await this.miscService.paginate({
      page: usePage,
      pageSize: body.pageSize,
    });
    const $regex = new RegExp(name, 'i');
    const options: any = await this.miscService.search(rest);
    options.is_deleted = false;
    const projects: Project[] = await this.projectModel
      .find({
        name: { $regex },
        mda: mda.id,
      })
      .find({ name: { $regex } })
      .populate('mda', 'name logo')
      .sort({ created_at: sort == -1 ? -1 : 1 })
      .skip(pagination.offset)
      .limit(pagination.limit);

    const totalNews: number = await this.projectModel.countDocuments({
      name: { $regex },
      mda: mda.id,
      ...options,
    });

    const total = totalNews;
    const totalPages = Math.ceil(total / pageSize);
    const nextPage = Number(page) < totalPages ? Number(page) + 1 : null;
    const prevPage = Number(page) > 1 ? Number(page) - 1 : null;

    return {
      pagination: {
        currentPage: Number(usePage),
        totalPages,
        nextPage,
        prevPage,
        total,
        pageSize: Number(pageSize),
      },
      data: projects,
    };
  }

  async getProjectsForAdmin(body: GetProjectsAdminDto): Promise<any> {
    const { page = 1, pageSize = 10, sort = -1, name, mdaId, ...rest } = body;
    const usePage: number = body.page < 1 ? 1 : body.page;
    const pagination = await this.miscService.paginate({
      page: usePage,
      pageSize: body.pageSize,
    });
    const $regex = new RegExp(name, 'i');
    const options: any = await this.miscService.search(rest);
    options.is_deleted = false;
    if (mdaId) {
      options.mda = mdaId;
    }
    const projects: Project[] = await this.projectModel
      .find({
        name: { $regex },
        ...options,
      })
      .find({ name: { $regex } })
      .populate('mda', 'name logo')
      .sort({ created_at: sort == -1 ? -1 : 1 })
      .skip(pagination.offset)
      .limit(pagination.limit);

    const totalNews: number = await this.projectModel.countDocuments({
      name: { $regex },
    });

    const total = totalNews;
    const totalPages = Math.ceil(total / pageSize);
    const nextPage = Number(page) < totalPages ? Number(page) + 1 : null;
    const prevPage = Number(page) > 1 ? Number(page) - 1 : null;

    return {
      pagination: {
        currentPage: Number(usePage),
        totalPages,
        nextPage,
        prevPage,
        total,
        pageSize: Number(pageSize),
      },
      data: projects,
    };
  }

  async getProjectsForUser(body: GetProjectsAdminDto): Promise<any> {
    const { page = 1, pageSize = 10, sort = -1, name, mdaId, ...rest } = body;
    const usePage: number = body.page < 1 ? 1 : body.page;
    const pagination = await this.miscService.paginate({
      page: usePage,
      pageSize: body.pageSize,
    });
    const $regex = new RegExp(name, 'i');
    const options: any = await this.miscService.search(rest);
    options.is_deleted = false;
    if (mdaId) {
      options.mda = mdaId;
    }
    const projects: Project[] = await this.projectModel
      .find({
        name: { $regex },
        ...options,
      })
      .find({ name: { $regex } })
      .populate('mda', 'name logo')
      .sort({ created_at: sort == -1 ? -1 : 1 })
      .skip(pagination.offset)
      .limit(pagination.limit);

    const totalNews: number = await this.projectModel.countDocuments({
      name: { $regex },
    });

    const total = totalNews;
    const totalPages = Math.ceil(total / pageSize);
    const nextPage = Number(page) < totalPages ? Number(page) + 1 : null;
    const prevPage = Number(page) > 1 ? Number(page) - 1 : null;

    return {
      pagination: {
        currentPage: Number(usePage),
        totalPages,
        nextPage,
        prevPage,
        total,
        pageSize: Number(pageSize),
      },
      data: projects,
    };
  }
}
