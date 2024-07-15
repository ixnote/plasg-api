import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
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
import { GetResourceDto } from '../dtos/get-resource.dto';
import { GetResourcesDto } from '../dtos/get-resources.dto';
import { TagType } from 'src/common/constants/enum';

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
    if(body.main_topic_tag){
      const findTag: Tag = await this.tagService.findByIdAndType(body.main_topic_tag, TagType.TOPIC)
      if(!findTag) throw new NotFoundException({
        status: false,
        message: "Main topic tag not found"
      })
    }
    if(body.sub_topic_tag){
      const findTag: Tag = await this.tagService.findByIdAndType(body.sub_topic_tag, TagType.TOPIC)
      if(!findTag) throw new NotFoundException({
        status: false,
        message: "Sub topic tag not found"
      })
    }
    if(body.main_type_tag){
      const findTag: Tag = await this.tagService.findByIdAndType(body.main_type_tag, TagType.ITEM)
      if(!findTag) throw new NotFoundException({
        status: false,
        message: "Main type tag not found"
      })
    }
    if(body.sub_type_tag){
      const findTag: Tag = await this.tagService.findByIdAndType(body.sub_type_tag, TagType.ITEM)
      if(!findTag) throw new NotFoundException({
        status: false,
        message: "Sub type tag not found"
      })
    }
    for(let i = 0; i < body.all_topic_tags.length; i++){
      const findTag: Tag = await this.tagService.findByIdAndType(body.all_topic_tags[i], TagType.TOPIC)
      if(!findTag) throw new NotFoundException({
        status: false,
        message: `Topic Tag in position ${i} of All topic tags not found`
      })
    }
    return await this.create({ ...body, mda: mda.id });
  }

  async getResourceById(body: GetResourceDto){
    const resource: Resource = await this.findById(body.resourceId)
    if(!resource) throw new NotFoundException({
      status: false,
      message: "Ressource not found"
    })
    return resource

  }

  async searchResources(param: {name: string}, body: SearchResourcesDto) {
    const { name } = param;
    const { page = 1, pageSize = 10, ...rest } = body;
    const usePage: number = page < 1 ? 1 : page;
    const pagination = await this.miscService.paginate({
      page: usePage,
      pageSize,
    });
    const tag: Tag = await this.tagService.findOneUsingRegex(name);
    interface QueryConditions {
      name?: { $regex: string; $options: string };
      description?: { $regex: string; $options: string };
      all_topic_tags?: { $elemMatch: { $eq: string } };
      main_type_tag?: { $eq: string };
      sub_type_tag?: { $eq: string };
      main_topic_tag?: { $eq: string };
      sub_topic_tag?: { $eq: string };
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

  async getResources(body: GetResourcesDto): Promise<any>{
    const { page = 1, pageSize = 10, main_type_tag, main_topic_tag, sub_type_tag, sub_topic_tag, all_topic_tag, ...rest } = body;
    const extraQuery: any = {};

    if (body.main_type_tag) {
      extraQuery.main_type_tag = main_type_tag;
    }
    if (body.main_topic_tag) {
      extraQuery.main_topic_tag = main_topic_tag;
    }

    if (body.sub_topic_tag) {
      extraQuery.sub_topic_tag = sub_topic_tag;
    }
    
    if (body.sub_type_tag) {
      extraQuery.sub_type_tag = sub_type_tag
    }

    if (all_topic_tag) {
      extraQuery.all_topic_tags = { $in: [all_topic_tag] };
    }

    const usePage: number = page < 1 ? 1 : page;
    const pagination = await this.miscService.paginate({
      page: usePage,
      pageSize,
    });
    const options: any = await this.miscService.search(rest);
    const query = { ...options, ...extraQuery };
    const resources: Resource[] = await this.resourceModel
    .find(query)
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
