import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Mda } from '../interfaces/mda.interface';
import { Model, SortOrder } from 'mongoose';
import { MongooseService } from 'src/common/helpers/mongoose.helper';
import { CreateMdaDto } from '../dtos/create-mda.dto';
import { AssignMdaDto } from '../dtos/assign-mda.dto';
import { User } from 'src/modules/user/interfaces/user.interface';
import { UserService } from 'src/modules/user/services/user.service';
import { RemoveMdaDto } from '../dtos/remove-mda.dto';
import { GetMdaDto } from '../dtos/get-mda.dto';
import { MdaPaginationDto } from '../dtos/mda-pagination.dto';
import { MiscClass } from 'src/common/services/misc.service';
import { CloudinaryService } from 'src/common/services/cloudinary/cloudinary.service';
import { UpdateMdaDto } from '../dtos/update-mda.dto';
import { AddTeamMembersDto } from '../dtos/add-team.dto';
import { Team } from '../interfaces/team.interface';
import { GetTeamDto } from '../dtos/get-team.dto';
import slugify from 'slugify';
import { GetMdaBySlugDto } from '../dtos/get-mda-by-slug.dto';
import { GlobalSearchPaginationDto } from 'src/modules/statics/dtos/global-search.dto';
import { Resource } from 'src/modules/resource/interfaces/resource.interface';

@Injectable()
export class MdaService {
  constructor(
    @InjectModel('Mda') private readonly mdaModel: Model<Mda>,
    @InjectModel('Resource') private readonly resourceModel: Model<Resource>,
    private userService: UserService,
    private miscService: MiscClass,
  ) {}

  async create(body: CreateMdaDto): Promise<Mda> {
    const createdMda = new this.mdaModel(body);
    return createdMda.save();
  }

  async findAll(): Promise<Mda[]> {
    return this.mdaModel.find().exec();
  }

  async findById(id: string): Promise<Mda> {
    return this.mdaModel.findById(id);
  }

  async findBySlug(slug: string): Promise<Mda> {
    return this.mdaModel.findOne({ slug });
  }

  async findByName(name: string): Promise<Mda> {
    return this.mdaModel.findOne({ name }).exec();
  }

  async regexSearch(body: GlobalSearchPaginationDto): Promise<any> {
    const { page = 1, pageSize = 10, sort = -1, name } = body;
    const usePage: number = body.page < 1 ? 1 : body.page;
    const pagination = await this.miscService.paginate({
      page: usePage,
      pageSize: body.pageSize,
    });
    const $regex = new RegExp(body.name, 'i');
    const mdas: Mda[] = await this.mdaModel
      .find({ name: { $regex } })
      .sort({ created_at: sort == -1 ? -1 : 1 })
      .skip(pagination.offset)
      .limit(pagination.limit);

    const totalMdas: Mda[] = await this.mdaModel.find({ name: { $regex } });
    const total = totalMdas.length;
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
      data: mdas,
    };
  }

  async findByUser(admin: string): Promise<Mda> {
    return this.mdaModel.findOne({ admin }).exec();
  }

  async createMda(body: CreateMdaDto): Promise<Mda> {
    const { name } = body;
    const mda: Mda = await this.findByName(name);
    if (mda)
      throw new BadRequestException({
        status: false,
        message: 'Mda already exists',
      });

    const slug = slugify(body.name, '_');
    return await this.create({ ...body, slug });
  }

  async totalNumberOfMdas(): Promise<number> {
    const totalMdas: Mda[] = await this.mdaModel.find();
    return totalMdas.length;
  }
  async updateMda(param: GetMdaDto, body: UpdateMdaDto): Promise<Mda> {
    const mda: Mda = await this.findById(param.mdaId);
    if (!mda)
      throw new NotFoundException({
        status: false,
        message: 'Mda not found',
      });
    if (body.name) body.slug = slugify(body.name, '_');
    return await this.mdaModel.findByIdAndUpdate(param.mdaId, body, {
      new: true,
    });
  }

  async getMdas(): Promise<Mda[]> {
    return await this.mdaModel
      .find()
      .select('name admin')
      .populate('admin', 'full_name email phone');
  }

  async getMda(body: GetMdaDto): Promise<Mda> {
    const mda: Mda = await this.mdaModel.findById(body.mdaId).populate('admin');
    if (!mda)
      throw new NotFoundException({
        status: false,
        message: 'Mda not found!',
      });
    return mda;
  }

  async getMdaBySlug(body: GetMdaBySlugDto): Promise<any> {
    const mda: Mda = await this.findBySlug(body.slug);
    if (!mda)
      throw new NotFoundException({
        status: false,
        message: 'Mda not found!',
      });

    if (!mda)
      throw new NotFoundException({
        status: false,
        message: 'Mda not found!',
      });
    const resources = await this.resourceModel
      .find({ mda: mda?.id })
      .sort({ createdAt: -1 })
      .populate('main_type_tag', 'name type')
      .populate('sub_type_tag', 'name type')
      .populate('main_topic_tag', 'name type')
      .populate('all_topic_tags', 'name type')
      .populate('mda', 'name slug')
      .exec();
    return { mda, resources };
  }

  async fetchMdas(body: MdaPaginationDto): Promise<any> {
    const { page = 1, pageSize = 10, ...rest } = body;
    const usePage: number = page < 1 ? 1 : page;
    const pagination = await this.miscService.paginate({
      page: usePage,
      pageSize,
    });
    const options: any = await this.miscService.search(rest);
    options.is_suspended = false;
    options.is_deleted = false;
    // options.published = true;
    const mdasTotal: Mda[] = await this.mdaModel.find(options);
    const totalMdasCount = mdasTotal.length;
    const totalPages = Math.ceil(totalMdasCount / pageSize);
    const nextPage = Number(page) < totalPages ? Number(page) + 1 : null;
    const prevPage = Number(page) > 1 ? Number(page) - 1 : null;

    const mdas: Mda[] = await this.mdaModel
      .find(options)
      .populate('admin', 'full_name email phone')
      .skip(pagination.offset)
      .limit(pagination.limit)
      .sort({ createdAt: -1 });

    return {
      pagination: {
        currentPage: Number(usePage),
        totalPages,
        nextPage,
        prevPage,
        totalNews: totalMdasCount,
        pageSize: Number(pageSize),
      },
      mdas,
    };
  }

  async fetchMdasAdmin(body: MdaPaginationDto): Promise<any> {
    const { page = 1, pageSize = 10, ...rest } = body;
    const usePage: number = page < 1 ? 1 : page;
    const pagination = await this.miscService.paginate({
      page: usePage,
      pageSize,
    });
    const options: any = await this.miscService.search(rest);
    options.is_suspended = false;
    options.is_deleted = false;
    const mdasTotal: Mda[] = await this.mdaModel.find(options);
    const totalMdasCount = mdasTotal.length;
    const totalPages = Math.ceil(totalMdasCount / pageSize);
    const nextPage = Number(page) < totalPages ? Number(page) + 1 : null;
    const prevPage = Number(page) > 1 ? Number(page) - 1 : null;

    const mdas: Mda[] = await this.mdaModel
      .find(options)
      .populate('admin', 'full_name email phone')
      .skip(pagination.offset)
      .limit(pagination.limit)
      .sort({ createdAt: -1 });

    return {
      pagination: {
        currentPage: Number(usePage),
        totalPages,
        nextPage,
        prevPage,
        totalNews: totalMdasCount,
        pageSize: Number(pageSize),
      },
      mdas,
    };
  }
  async findOneAndUpdate(body: CreateMdaDto): Promise<Mda> {
    const { name } = body;
    return await this.mdaModel.findOneAndUpdate(
      { name },
      { name },
      { upsert: true, new: true, runValidators: true },
    );
  }

  async assignAdminToMda(body: AssignMdaDto): Promise<string> {
    const { admin, mda } = body;
    const user: User = await this.userService.findById(admin);
    if (!user)
      throw new NotFoundException({
        status: false,
        message: 'User not found!',
      });
    const findMda: Mda = await this.findById(mda);
    if (!findMda)
      throw new NotFoundException({
        status: false,
        message: 'Mda not found!',
      });
    if (findMda?.admin)
      throw new UnauthorizedException({
        status: false,
        message: 'This Mda already has an admin',
      });
    const findIfUserIsConnectedToMda = await this.mdaModel.findOne({
      user: user.id,
    });
    if (findIfUserIsConnectedToMda)
      throw new BadRequestException({
        status: false,
        message: 'User currently handles an Mda',
      });
    await this.mdaModel.findByIdAndUpdate(mda, {
      admin,
    });
    await this.userService.assignMdaToUser(mda, admin);
    return 'Mda assigned successfully.';
  }

  async removeUserFromMda(body: RemoveMdaDto): Promise<string> {
    await this.mdaModel.findByIdAndUpdate(body.mda, {
      admin: null,
    });
    await this.userService.unassignMdaFromUser(body.mda);
    return 'Admin unassigned successfully.';
  }

  // Team
  async addMdaTeamMember(
    param: GetMdaDto,
    body: AddTeamMembersDto,
  ): Promise<Mda> {
    const mda: Mda = await this.findById(param.mdaId);
    if (!mda)
      throw new NotFoundException({
        status: false,
        message: 'Mda not found',
      });
    const team: any[] = mda.team;
    team.push({ ...body });

    console.log('🚀 ~ MdaService ~ addMdaTeamMember ~ team:', team);
    return await this.mdaModel.findByIdAndUpdate(
      mda.id,
      { team },
      { new: true },
    );
  }

  async removeMdaTeamMember(param: GetTeamDto): Promise<Mda> {
    const mda: Mda = await this.findById(param.mdaId);
    if (!mda)
      throw new NotFoundException({
        status: false,
        message: 'Mda not found',
      });
    mda.team = mda.team.filter((teamMember) => teamMember.name !== param.name);
    return await mda.save();
  }
}
