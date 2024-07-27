import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Destination } from '../interfaces/destination.interface';
import mongoose, { Model } from 'mongoose';
import { GetDestinationsDto } from '../dtos/get-destinations.dto';
import { MiscClass } from 'src/common/services/misc.service';
import { GetDestinationDto } from '../dtos/get-destination.dto';
import { Legislative } from '../interfaces/legislative.interface';
import { AddLegislativeDto } from '../dtos/add-legislative.dto';
import { GetLegislativeDto } from '../dtos/get-legislative.dto';
import { GetLegislativesDto } from '../dtos/get-legislatives.dto';
import { AddDestinationDto } from '../dtos/add-destination.dto';
import { CloudinaryService } from 'src/common/services/cloudinary/cloudinary.service';
import { LegislativeTypes } from 'src/common/constants/enum';
import { User } from 'src/modules/user/interfaces/user.interface';
import { UserService } from 'src/modules/user/services/user.service';
import { MdaService } from 'src/modules/mda/services/mda.service';
import { NewsService } from 'src/modules/news/services/news.service';
import { Mda } from 'src/modules/mda/interfaces/mda.interface';
import { ResourceService } from 'src/modules/resource/services/resource.service';
import { AddGovernmentOfficialDto } from '../dtos/add-governement-official.dto';
import { UpdateGovernmentOfficialDto } from '../dtos/update-government-officaial.dto';
import { News } from 'src/modules/news/interfaces/news.interface';
import { Resource } from 'src/modules/resource/interfaces/resource.interface';
import { GlobalSearchPaginationDto } from '../dtos/global-search.dto';

@Injectable()
export class StaticsService {
  constructor(
    @InjectModel('Destination')
    private readonly destinationModel: Model<Destination>,
    @InjectModel('Legislative')
    private readonly legislativeModel: Model<Legislative>,
    private miscService: MiscClass,
    private cloudinaryService: CloudinaryService,
    private userService: UserService,
    private mdaService: MdaService,
    private newsService: NewsService,
    private resourceService: ResourceService,
  ) {}

  async adminDashboard() {
    const totalUsers: number = await this.userService.getTotalNumberOfUsers();
    const totalMdas: number = await this.mdaService.totalNumberOfMdas();
    const totalNews: number = await this.newsService.totalNumberOfNews();
    return {
      users: totalUsers,
      mdas: totalMdas,
      news: totalNews,
    };
  }

  async mdaDashboard(user: User) {
    const mda: Mda = await this.mdaService.findByUser(user.id);
    if (!mda)
      throw new NotFoundException({
        status: false,
        message: 'Mda not found',
      });
    const newsToday = await this.newsService.getTotalNewsToday(mda.id);
    const resourcesToday = await this.resourceService.getTotalResourcesToday(
      mda.id,
    );

    const newsThisMonth = await this.newsService.getTotalNewsMonth(mda.id);
    const resourcesThisMonth =
      await this.resourceService.getTotalResourcesMonth(mda.id);

    const newsAllTime = await this.newsService.getTotalNewsAllTime(mda.id);
    const resourcesAllTime =
      await this.resourceService.getTotalResourcesAllTime(mda.id);

    return {
      articles: {
        today: newsToday,
        month: newsThisMonth,
        all_time: newsAllTime,
      },
      resources: {
        today: resourcesToday,
        month: resourcesThisMonth,
        all_time: resourcesAllTime,
      },
      mda,
    };
  }

  async globalSearch(body: GlobalSearchPaginationDto) {
    const { page = 1, pageSize = 10, name } = body;
    const mdas: Mda[] = await this.mdaService.regexSearch(body);
    const news: News[] = await this.newsService.regexSearch(body);
    const resources: Resource[] = await this.resourceService.regexSearch(body);
    const government: Legislative[] = await this.governmentRegexSearch(body);
    const legislatives: Legislative[] = await this.legislativeRegexSearch(body);
    const destinations: Destination[] = await this.destinationRegexSearch(body);
    return {
      mdas,
      news,
      resources,
      government,
      legislatives,
      destinations,
    };
  }

  async governmentRegexSearch(
    body: GlobalSearchPaginationDto,
  ): Promise<Legislative[]> {
    const usePage: number = body.page < 1 ? 1 : body.page;
    const pagination = await this.miscService.paginate({
      page: usePage,
      pageSize: body.pageSize,
    });
    const $regex = new RegExp(body.name, 'i');
    return await this.legislativeModel
      .find({
        name: { $regex },
        type: LegislativeTypes.OFFICIAL,
      })
      .skip(pagination.offset)
      .limit(pagination.limit);
  }

  async legislativeRegexSearch(
    body: GlobalSearchPaginationDto,
  ): Promise<Legislative[]> {
    const usePage: number = body.page < 1 ? 1 : body.page;
    const pagination = await this.miscService.paginate({
      page: usePage,
      pageSize: body.pageSize,
    });
    const $regex = new RegExp(body.name, 'i');
    return await this.legislativeModel
      .find({
        name: { $regex },
        type: { $ne: LegislativeTypes.OFFICIAL },
      })
      .skip(pagination.offset)
      .limit(pagination.limit);
  }

  async destinationRegexSearch(
    body: GlobalSearchPaginationDto,
  ): Promise<Destination[]> {
    const usePage: number = body.page < 1 ? 1 : body.page;
    const pagination = await this.miscService.paginate({
      page: usePage,
      pageSize: body.pageSize,
    });
    const $regex = new RegExp(body.name, 'i');
    return await this.destinationModel
      .find({
        name: { $regex },
      })
      .skip(pagination.offset)
      .limit(pagination.limit);
  }
  async addLegislative(body: AddLegislativeDto): Promise<Legislative> {
    const findLegislative: Legislative = await this.legislativeModel.findOne({
      name: body.name,
      role: body.role,
    });
    if (findLegislative)
      throw new BadRequestException({
        status: false,
        message: 'Legislative already exists',
      });
    const legislative: Legislative = new this.legislativeModel(body);
    return await legislative.save();
  }

  async getCurrentGovernment(): Promise<Legislative> {
    const government: Legislative = await this.legislativeModel.findOne({
      type: LegislativeTypes.OFFICIAL,
      active: true,
    });
    if (!government)
      throw new NotFoundException({
        status: false,
        message: 'No active government.',
      });
    return government;
  }

  async addGovernmentOfficial(
    body: AddGovernmentOfficialDto,
  ): Promise<Legislative> {
    const findLegislative: Legislative = await this.legislativeModel.findOne({
      name: body.name,
      type: LegislativeTypes.OFFICIAL,
    });
    if (findLegislative)
      throw new NotFoundException({
        status: false,
        message: 'Legislative already exists',
      });
    const legislative: Legislative = new this.legislativeModel({
      ...body,
      type: LegislativeTypes.OFFICIAL,
    });
    return await legislative.save();
  }

  async getActiveGovernment() {
    const government: Legislative = await this.legislativeModel.findOne({
      type: LegislativeTypes.OFFICIAL,
      active: true,
    });
    if (!government)
      throw new NotFoundException({
        status: false,
        message: 'No active government',
      });
    return government;
  }

  async updateGovernment(
    param: GetLegislativeDto,
    body: UpdateGovernmentOfficialDto,
  ): Promise<Legislative> {
    const findLegislative = await this.legislativeModel.findById(
      param.legislativeId,
    );
    if (!findLegislative) {
      throw new NotFoundException({
        status: true,
        message: 'Official not found',
      });
    }
    if (body?.active) {
      const governments: Legislative[] = await this.legislativeModel.find({
        type: LegislativeTypes.OFFICIAL,
      });
      for (const government of governments) {
        government.active = false;
        await government.save();
      }
    }
    const parentId = new mongoose.Types.ObjectId(param.legislativeId);
    if (body.members && body.members.length > 0) {
      const members = [];
      for (const item of body.members) {
        let member = await this.legislativeModel.findOne({
          name: item.name,
          parent: parentId,
          type: LegislativeTypes.CABINET,
        });

        if (!member) {
          member = new this.legislativeModel({
            ...item,
            parent: param.legislativeId,
            type: LegislativeTypes.CABINET,
          });
          await member.save();
          members.push(member.id);
        } else {
          member = await this.legislativeModel.findOneAndUpdate(
            { name: member.name, type: LegislativeTypes.CABINET },
            { ...member },
            { upsert: true, new: true, runValidators: true },
          );
          members.push(member.id);
        }
      }
      findLegislative.members = members;
      await findLegislative.save();
      delete body.members;
    }

    if (body.executives && body.executives.length > 0) {
      const executives = [];
      for (const item of body.executives) {
        let executive = await this.legislativeModel.findOne({
          name: item.name,
          type: LegislativeTypes.CABINET,
          parent: parentId,
        });
        if (!executive) {
          executive = new this.legislativeModel({
            ...item,
            parent: param.legislativeId,
            type: LegislativeTypes.CABINET,
          });
          await executive.save();
        } else {
          executive = await this.legislativeModel.findOneAndUpdate(
            { name: executive.name, type: LegislativeTypes.CABINET },
            { ...executive },
            { upsert: true, new: true, runValidators: true },
          );
        }
        executives.push(executive.id);
      }
      findLegislative.executives = executives;
      await findLegislative.save();
      delete body.executives;
    }

    return await this.legislativeModel.findByIdAndUpdate(
      param.legislativeId,
      body,
      { new: true },
    );
  }

  async getGovernmentOfficial(body: GetLegislativeDto) {
    const legislative: Legislative = await this.legislativeModel.findOne({
      _id: body.legislativeId,
      type: LegislativeTypes.OFFICIAL,
    });
    if (!legislative)
      throw new NotFoundException({
        status: false,
        message: 'Legislative not found',
      });
    return legislative;
  }

  async getGovernments(body: GetLegislativesDto) {
    return await this.legislativeModel
      .find({
        type: LegislativeTypes.OFFICIAL,
      })
      .sort({ end: -1 });
  }

  async updateLegislatives(body: AddLegislativeDto): Promise<Legislative> {
    let data: any = { ...body };
    const updatedDestination: Legislative = await this.legislativeModel
      .findOneAndUpdate(
        { name: data.name },
        { $set: data },
        { new: true, upsert: true },
      )
      .exec();

    return updatedDestination;
  }

  async deleteLegislative(body: GetLegislativeDto): Promise<Legislative> {
    const legislative: Legislative = await this.legislativeModel.findById(
      body.legislativeId,
    );
    if (!legislative)
      throw new NotFoundException({
        status: false,
        message: 'Legislative already exists',
      });
    legislative.is_deleted = true;
    return await legislative.save();
  }

  // async getGovernorsCabinet(query: GetLegislativesDto): Promise<any> {
  //   const { page = 1, pageSize = 10, ...rest } = query;
  //   const usePage: number = page < 1 ? 1 : page;
  //   const pagination = await this.miscService.paginate({
  //     page: usePage,
  //     pageSize,
  //   });
  //   const options: any = await this.miscService.search(rest);
  //   options.is_deleted = false;
  //   options.type = LegislativeTypes.GOVERNOR;
  //   const legislatives: Legislative[] = await this.legislativeModel
  //     .find(options)
  //     .skip(pagination.offset)
  //     .limit(pagination.limit)
  //     .sort({ createdAt: -1 })
  //     .exec();

  //   const total = legislatives.length;
  //   const totalPages = Math.ceil(total / pageSize);
  //   const nextPage = Number(page) < totalPages ? Number(page) + 1 : null;
  //   const prevPage = Number(page) > 1 ? Number(page) - 1 : null;

  //   return {
  //     pagination: {
  //       currentPage: Number(usePage),
  //       totalPages,
  //       nextPage,
  //       prevPage,
  //       total,
  //       pageSize: Number(pageSize),
  //     },
  //     data: legislatives,
  //   };
  // }

  async getLegislatives(query: GetLegislativesDto): Promise<any> {
    const { page = 1, pageSize = 10, ...rest } = query;
    const usePage: number = page < 1 ? 1 : page;
    const pagination = await this.miscService.paginate({
      page: usePage,
      pageSize,
    });
    const options: any = await this.miscService.search(rest);
    options.is_deleted = false;
    options.type = LegislativeTypes.LEGISLATIVE;
    const legislatives: Legislative[] = await this.legislativeModel
      .find(options)
      .skip(pagination.offset)
      .limit(pagination.limit)
      .sort({ createdAt: -1 })
      .exec();

    const total = legislatives.length;
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
      data: legislatives,
    };
  }

  async getLegislative(param: GetLegislativeDto) {
    const legislative: Legislative = await this.legislativeModel.findById(
      param.legislativeId,
    );
    if (!legislative || legislative.is_deleted)
      throw new NotFoundException({
        status: false,
        message: 'Legislative not found',
      });
    return legislative;
  }

  async addDestination(body: AddDestinationDto): Promise<Destination> {
    let data: any = { ...body };
    if (body.file) {
      const response = await this.cloudinaryService.uploadFile(body.file);
      if (!response)
        throw new NotFoundException({
          status: 'error',
          message: 'Invalid File',
        });
      data.image = response.url;
      data.public_id = response.public_id;
    }
    const destination = new this.destinationModel(data);
    return await destination.save();
  }

  async updateDestinations(body: AddDestinationDto): Promise<Destination> {
    let data: any = { ...body };
    const updatedDestination: Destination = await this.destinationModel
      .findOneAndUpdate(
        { name: data.name },
        { $set: data },
        { new: true, upsert: true },
      )
      .exec();

    return updatedDestination;
  }

  async deleteDestination(param: GetDestinationDto) {
    const destination: Destination = await this.destinationModel.findById(
      param.destinationId,
    );
    if (!destination || destination.is_deleted)
      throw new NotFoundException({
        status: false,
        message: 'Destination not found',
      });
    destination.is_deleted = true;
    return await destination.save();
  }

  async getDestinations(query: GetDestinationsDto): Promise<any> {
    const { page = 1, pageSize = 10, ...rest } = query;
    const usePage: number = page < 1 ? 1 : page;
    const pagination = await this.miscService.paginate({
      page: usePage,
      pageSize,
    });
    const options: any = await this.miscService.search(rest);
    const destinations: Destination[] = await this.destinationModel
      .find(options)
      .skip(pagination.offset)
      .limit(pagination.limit)
      .sort({ createdAt: -1 });

    const total = destinations.length;
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
      destinations,
    };
  }

  async getDestination(param: GetDestinationDto): Promise<Destination> {
    const destination: Destination = await this.destinationModel.findById(
      param.destinationId,
    );
    if (!destination || destination.is_deleted)
      throw new NotFoundException({
        status: false,
        message: 'Destination not found',
      });
    return destination;
  }
}
