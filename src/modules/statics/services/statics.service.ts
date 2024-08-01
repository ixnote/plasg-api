/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prefer-const */
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Destination } from '../interfaces/destination.interface';
import mongoose, { Model, SortOrder } from 'mongoose';
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
import { Government } from '../interfaces/government.interface';
import { GetGovernmentDto } from '../dtos/get-government.dto';
import { GetGovernmentsDto } from '../dtos/get-governments.dto';

@Injectable()
export class StaticsService {
  constructor(
    @InjectModel('Destination')
    private readonly destinationModel: Model<Destination>,
    @InjectModel('Legislative')
    private readonly legislativeModel: Model<Legislative>,
    @InjectModel('Government')
    private readonly governmentModel: Model<Government>,
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
    const mdas: any = await this.mdaService.regexSearch(body);
    const news: any = await this.newsService.regexNewsSearch(body);
    const articles: any = await this.newsService.regexArticleSearch(body);
    const resources: any = await this.resourceService.regexSearch(body);
    const government = await this.governmentRegexSearch(body);
    const legislatives = await this.legislativeRegexSearch(body);
    const destinations = await this.destinationRegexSearch(body);
    const all = [
      ...mdas.data,
      ...news.data,
      ...resources.data,
      ...government.data,
      ...legislatives.data,
      ...destinations.data,
      ...articles.data,
    ];
    const showAll = await this.shuffleArray(all);
    return {
      mdas,
      news,
      // articles,
      articles: resources,
      government,
      legislatives,
      destinations,
      showAll: {
        data: showAll,
      },
    };
  }

  async governmentRegexSearch(body: GlobalSearchPaginationDto): Promise<any> {
    const { page = 1, pageSize = 10, sort = -1, name } = body;

    const usePage: number = body.page < 1 ? 1 : body.page;
    const pagination = await this.miscService.paginate({
      page: usePage,
      pageSize: body.pageSize,
    });
    const $regex = new RegExp(body.name, 'i');
    const governments: Legislative[] = await this.legislativeModel
      .find({
        name: { $regex },
        type: LegislativeTypes.OFFICIAL,
      })
      .sort({ created_at: sort === -1 ? -1 : 1 })
      .skip(pagination.offset)
      .limit(pagination.limit);

    const totalGovernments: Legislative[] = await this.legislativeModel.find({
      name: { $regex },
      type: LegislativeTypes.OFFICIAL,
    });

    const total = totalGovernments.length;
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
      data: governments,
    };
  }

  async legislativeRegexSearch(body: GlobalSearchPaginationDto): Promise<any> {
    const { page = 1, pageSize = 10, sort = -1, name } = body;
    const usePage: number = body.page < 1 ? 1 : body.page;
    const pagination = await this.miscService.paginate({
      page: usePage,
      pageSize: body.pageSize,
    });
    const $regex = new RegExp(body.name, 'i');
    const legislatives: Legislative[] = await this.legislativeModel
      .find({
        name: { $regex },
        type: { $ne: LegislativeTypes.OFFICIAL },
      })
      .sort({ created_at: sort === -1 ? -1 : 1 })
      .skip(pagination.offset)
      .limit(pagination.limit);

    const totalLegislatives: Legislative[] = await this.legislativeModel.find({
      name: { $regex },
      type: { $ne: LegislativeTypes.OFFICIAL },
    });

    const total = totalLegislatives.length;
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

  async destinationRegexSearch(body: GlobalSearchPaginationDto): Promise<any> {
    const { page = 1, pageSize = 10, sort = -1, name } = body;

    const usePage: number = body.page < 1 ? 1 : body.page;
    const pagination = await this.miscService.paginate({
      page: usePage,
      pageSize: body.pageSize,
    });
    const $regex = new RegExp(body.name, 'i');
    const destinations: Destination[] = await this.destinationModel
      .find({
        name: { $regex },
      })
      .sort({ created_at: sort === -1 ? -1 : 1 })
      .skip(pagination.offset)
      .limit(pagination.limit);

    const totalDestinations: Destination[] = await this.destinationModel.find({
      name: { $regex },
    });

    const total = totalDestinations.length;
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
      data: destinations,
    };
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

  async addGovernment(body: AddGovernmentOfficialDto): Promise<Government> {
    const findGovernment: Government = await this.governmentModel.findOne({
      name: body.name,
    });
    if (findGovernment)
      throw new NotFoundException({
        status: false,
        message: 'Government already exists',
      });
    const government = new this.governmentModel({
      ...body,
    });
    return await government.save();
  }

  async getActiveGovernment() {
    const government: Government = await this.governmentModel
      .findOne({
        active: true,
      })
      .populate('governor')
      .populate('members')
      .populate('executives');
    if (!government)
      throw new NotFoundException({
        status: false,
        message: 'No active government',
      });
    return government;
  }

  async updateGovernment(
    param: GetGovernmentDto,
    body: UpdateGovernmentOfficialDto,
  ): Promise<Government> {
    const findGovernment = await this.governmentModel.findById(
      param.governmentId,
    );
    if (!findGovernment) {
      throw new NotFoundException({
        status: true,
        message: 'Official not found',
      });
    }
    if (body?.active) {
      const governments: Government[] = await this.governmentModel.find({
        type: LegislativeTypes.OFFICIAL,
      });
      for (const government of governments) {
        government.active = false;
        await government.save();
      }
    }
    const government = new mongoose.Types.ObjectId(param.governmentId);
    if (body.governor) {
      const legislative: Legislative = await this.legislativeModel.findById(body.governor)
      if(!legislative) throw new NotFoundException({
        status: false,
        message: "Governor not found"
      })
      findGovernment.governor = new mongoose.Types.ObjectId(body.governor);
      await findGovernment.save();
      delete body.governor;
    }
    if (body.members && body.members.length > 0) {
      const members = [];
      for (const item of body.members) {
        let member = await this.legislativeModel.findOne({
          name: item.name,
          government,
          type: LegislativeTypes.CABINET,
        });

        if (!member) {
          member = new this.legislativeModel({
            ...item,
            government,
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
      findGovernment.members = members;
      await findGovernment.save();
      delete body.members;
    }

    if (body.executives && body.executives.length > 0) {
      const executives = [];
      for (const item of body.executives) {
        let executive = await this.legislativeModel.findOne({
          name: item.name,
          type: LegislativeTypes.CABINET,
          government,
        });
        if (!executive) {
          executive = new this.legislativeModel({
            ...item,
            government,
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
      findGovernment.executives = executives;
      await findGovernment.save();
      delete body.executives;
    }

    return await this.governmentModel.findByIdAndUpdate(
      param.governmentId,
      body,
      { new: true },
    );
  }

  async getGovernment(body: GetGovernmentDto) {
    const government: Government = await this.governmentModel
      .findOne({
        _id: body.governmentId,
      })
      .populate('governor')
      .populate('members')
      .populate('executives');
    if (!government)
      throw new NotFoundException({
        status: false,
        message: 'Government not found',
      });
    return government;
  }

  async getGovernments(body: GetGovernmentsDto): Promise<any> {
    const { page = 1, pageSize = 20, ...rest } = body;
    const usePage: number = page < 1 ? 1 : page;
    const pagination = await this.miscService.paginate({
      page: usePage,
      pageSize,
    });
    const options: any = await this.miscService.search(rest);

    const governments: Government[] = await this.governmentModel
      .find(options)
      .sort({ end: -1 })
      .populate('governor')
      .populate('members')
      .populate('executives')
      .skip(pagination.offset)
      .limit(pagination.limit);

    const governmentTotal: Government[] = await this.governmentModel
      .find(options)
      .sort({ end: -1 });

    const totalMdasCount = governmentTotal.length;
    const totalPages = Math.ceil(totalMdasCount / pageSize);
    const nextPage = Number(page) < totalPages ? Number(page) + 1 : null;
    const prevPage = Number(page) > 1 ? Number(page) - 1 : null;

    return {
      pagination: {
        currentPage: Number(usePage),
        totalPages,
        nextPage,
        prevPage,
        totalNews: totalMdasCount,
        pageSize: Number(pageSize),
      },
      governments,
    };
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

  async shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }
}
