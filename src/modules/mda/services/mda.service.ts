import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Mda } from '../interfaces/mda.interface';
import { Model } from 'mongoose';
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

@Injectable()
export class MdaService {
  constructor(
    @InjectModel('Mda') private readonly mdaModel: Model<Mda>,
    private mongooseService: MongooseService,
    private userService: UserService,
    private miscService: MiscClass,
    private cloudinaryService: CloudinaryService,
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

  async findByName(name: string): Promise<Mda> {
    return this.mdaModel.findOne({ name }).exec();
  }

  async findByUser(admin: string): Promise<Mda> {
    return this.mdaModel.findOne({ admin }).exec();
  }
  async createMda(body: CreateMdaDto, files: any): Promise<Mda> {
    const { name, team, about, director, hero } = body;
    const mda: Mda = await this.findByName(name);
    if(mda) throw new BadRequestException({
      status: false,
      message: "Mda already exists"
    })
    if (team.length !== files.files.length)
      throw new BadRequestException({
        status: false,
        message: 'team images must match number of team members',
      });
    if (files.about_image) {
      const response = await this.cloudinaryService.uploadFile(
        files.about_image[0],
      );
      if (!response)
        throw new NotFoundException({
          status: 'error',
          message: 'Invalid File',
        });
      about.image = response.url;
      about.public_id = response.public_id;
    }
    if (files.logo_image) {
      const response = await this.cloudinaryService.uploadFile(
        files.logo_image[0],
      );
      if (!response)
        throw new NotFoundException({
          status: 'error',
          message: 'Invalid File',
        });
      hero.logo = response.url;
      hero.logo_public_id = response.public_id;
    }
    if (files.hero_image) {
      const response = await this.cloudinaryService.uploadFile(
        files.hero_image[0],
      );
      if (!response)
        throw new NotFoundException({
          status: 'error',
          message: 'Invalid File',
        });
      hero.image = response.url;
      hero.image_public_id = response.public_id;
    }
    if (files.director_image) {
      const response = await this.cloudinaryService.uploadFile(
        files.director_image[0],
      );
      if (!response)
        throw new NotFoundException({
          status: 'error',
          message: 'Invalid File',
        });
      director.image = response.url;
      director.public_id = response.public_id;
    }
    for (let i = 0; i < files.files.length; i++) {
      const response = await this.cloudinaryService.uploadFile(files.files[i]);
      if (!response)
        throw new NotFoundException({
          status: 'error',
          message: 'Invalid File',
        });
      team[i].image = response.url;
      team[i].public_id = response.public_id;
    }
    return await this.create(body);
  }

  async getMdas(): Promise<Mda[]> {
    return await this.mdaModel
      .find()
      .select('name admin')
      .populate('admin', 'full_name email phone');
  }

  async getMda(body: GetMdaDto): Promise<Mda> {
    const mda: Mda = await this.findById(body.mdaId);
    if (!mda)
      throw new NotFoundException({
        status: false,
        message: 'Mda not found!',
      });
    return mda;
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
    const { name, contact } = body;
    return await this.mdaModel.findOneAndUpdate(
      { name },
      { name, contact },
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
    await this.mdaModel.findByIdAndUpdate(mda, {
      admin,
    });
    const findIfUserIsConnectedToMda = await this.mdaModel.findOne({
      user: user.id,
    });
    if (findIfUserIsConnectedToMda)
      throw new BadRequestException({
        status: false,
        message: 'User currently handles an Mda',
      });
    return 'Mda assigned successfully.';
  }

  async removeUserFromMda(body: RemoveMdaDto): Promise<string> {
    await this.mdaModel.findByIdAndUpdate(body.mda, {
      admin: null,
    });
    return 'Admin unassigned successfully.';
  }
}
