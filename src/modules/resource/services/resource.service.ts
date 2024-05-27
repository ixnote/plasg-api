import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Resource } from '../interfaces/resource.interface';
import { CreateResourceDto } from '../dtos/create-resource.dto';
import { ResourceData } from '../interfaces/create-resource.interface';
import { User } from 'src/modules/user/interfaces/user.interface';
import { Mda } from 'src/modules/mda/interfaces/mda.interface';
import { MdaService } from 'src/modules/mda/services/mda.service';
import { SearchResourcesDto } from '../dtos/search-resource.dto';
import { Tag } from 'src/modules/tag/interfaces/tag.interface';
import { TagService } from 'src/modules/tag/services/tag.service';
import { MiscClass } from 'src/common/services/misc.service';

@Injectable()
export class ResourceService {
  constructor(
    @InjectModel('Resource') private readonly resourceModel: Model<Resource>,
    private mdaService: MdaService,
    private tagService: TagService,
    private miscService: MiscClass,
  ) {}
  async create(body: ResourceData): Promise<Resource> {
    const resource = new this.resourceModel(body);
    return resource.save();
  }

  async findAll(): Promise<Resource[]> {
    return this.resourceModel.find().exec();
  }

  async findById(id: string): Promise<Resource> {
    return this.resourceModel.findById(id);
  }

  async findByName(name: string): Promise<Resource> {
    return this.resourceModel.findOne({ name }).exec();
  }

  async createResource(body: CreateResourceDto, user: User): Promise<Resource> {
    const mda: Mda = await this.mdaService.findByUser(user.id);
    if (!mda)
      throw new UnauthorizedException({
        status: false,
        message: "User isn't assigned to any Mda",
      });
    return await this.create({ ...body, mda: mda.id });
  }

  async getResources() {}

  async searchResources(body: SearchResourcesDto) {
    const { name } = body;
    const { page = 1, pageSize = 10, ...rest } = body;
    const usePage: number = page < 1 ? 1 : page;
    const pagination = await this.miscService.paginate({
      page: usePage,
      pageSize,
    });
    const options: any = await this.miscService.search(rest);
    const tag: Tag = await this.tagService.findOneUsingRegex(name);
    interface QueryConditions {
      name?: { $regex: string; $options: string };
      description?: { $regex: string; $options: string };
      all_topic_tags?: { $elemMatch: { $eq: string } };
      main_type_tag?: { $eq: string };
      sub_type_tag?: { $eq: string };
      main_topic_tag?: { $eq: string };
    }

    const query: QueryConditions = {
      name: { $regex: name, $options: 'i' },
      description: { $regex: name, $options: 'i' },
    };

    if (tag && tag.id) {
      query.all_topic_tags = { $elemMatch: { $eq: tag.id } };
      query.main_type_tag = { $eq: tag.id };
      query.sub_type_tag = { $eq: tag.id };
      query.main_topic_tag = { $eq: tag.id };
    }
    const queryArray = Object.keys(query).map((key) => ({ [key]: query[key] }));
    const resources: Resource[] = await this.resourceModel
      .find({
        $or: queryArray,
      })
      .skip(pagination.offset)
      .limit(pagination.limit)
      .sort({ createdAt: -1 })
      .populate('main_type_tag', "name type")
      .populate("sub_type_tag", "name type")
      .populate("main_topic_tag","name type")
      .populate("all_topic_tags", "name type")
      .exec();
    const total = resources.length;
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
      resources,
    };
  }
}
