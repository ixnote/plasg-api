import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Destination } from '../interfaces/destination.interface';
import { Model } from 'mongoose';
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
    };
  }


  async addLegislative(body: AddLegislativeDto): Promise<Legislative> {
    const findLegislative: Legislative = await this.legislativeModel.findOne({
      name: body.name,
      role: body.role,
    });
    if (findLegislative)
      throw new NotFoundException({
        status: false,
        message: 'Legislative already exists',
      });
    const legislative: Legislative = new this.legislativeModel(body);
    return await legislative.save();
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

  async getGovernorsCabinet(query: GetLegislativesDto): Promise<any> {
    const { page = 1, pageSize = 10, ...rest } = query;
    const usePage: number = page < 1 ? 1 : page;
    const pagination = await this.miscService.paginate({
      page: usePage,
      pageSize,
    });
    const options: any = await this.miscService.search(rest);
    options.is_deleted = false;
    options.type = LegislativeTypes.GOVERNOR;
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
