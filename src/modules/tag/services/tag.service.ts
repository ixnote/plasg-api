import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { Tag } from '../interfaces/tag.interface';
import { AddTagDto } from '../dtos/Add-tag.dto';
import { TagType } from 'src/common/constants/enum';

@Injectable()
export class TagService {
  constructor(@InjectModel('Tag') private readonly tagModel: Model<Tag>) {}
  async createTag(addTagDto: AddTagDto): Promise<Tag> {
    const tag = new this.tagModel({ ...addTagDto });
    return await tag.save();
  }

  async findById(id: string): Promise<Tag> {
    return this.tagModel.findById(id).populate('sub_tags');
  }

  async findByIdAndType(id: string, type: string): Promise<Tag> {
    return this.tagModel.findOne({_id: id, type}).populate('sub_tags');
  }

  async getTagByName(name: string) {
    return this.tagModel.findOne({name}).populate('sub_tags');
  }

  async getTags() {
    return await this.tagModel.find().populate('sub_tags');
  }

  async getTopicTags(): Promise<Tag[]> {
    return await this.tagModel
      .find({ type: TagType.TOPIC, parent: null, deleted: false })
      .select('-deleted -createdAt -updatedAt')
      .populate({
        path: 'sub_tags',
        match: { deleted: false },
        select: 'name type',
      });
  }

  async getTypeTags(): Promise<Tag[]> {
    return await this.tagModel
      .find({ type: TagType.ITEM, parent: null, deleted: false })
      .select('-deleted -createdAt -updatedAt')
      .populate({
        path: 'sub_tags',
        match: { deleted: false },
        select: 'name type',
      });
  }

  async addTag(body: AddTagDto): Promise<Tag> {
    const findTag: Tag = await this.tagModel.findOne({
      name: body.name.toLowerCase(),
    });
    let put_sub_tags = [];
    const sub_tags = body.sub_tags;
    delete body.sub_tags;
    if (findTag)
      throw new BadRequestException({
        status: false,
        message: 'Tag already exists',
      });
    const tag: Tag = await this.createTag(body);
    if (sub_tags.length > 0) {
      for (const item of sub_tags) {
        const use_tag = await new this.tagModel({
          name: item.toLowerCase(),
          type: TagType.TOPIC,
          parent: tag.id,
        });
        await use_tag.save();
        put_sub_tags.push(use_tag.id);
      }
      console.log('🚀 ~ TagService ~ addTag ~ put_sub_tags:', put_sub_tags);
      tag.sub_tags = put_sub_tags;
      await tag.save();
    }

    return tag;
  }

  async updateTag(id: string, body: AddTagDto): Promise<Tag> {
    return await this.tagModel.findByIdAndUpdate(
      id,
      {
        ...body,
      },
      { new: true },
    );
  }

  async findOneAndUpdate(
    name: string,
    type: string,
    title: string,
    description: string,
    parent?: string,
  ): Promise<Tag> {
    const tag: Tag = await this.tagModel.findOneAndUpdate(
      { name, type },
      { name, type, parent, title, description },
      { upsert: true, new: true, runValidators: true },
    );
    return tag
  }

  async findOneUsingRegex(name: string): Promise<Tag> {
    return await this.tagModel.findOne({
      name: { $regex: name, $options: 'i' },
    });
  }

  async updateSubTag(id: string, name: string) {
    const tag: Tag = await this.tagModel.findOne({ name });
    const updateTag: Tag = await this.findById(id);
    if (updateTag.id == tag.parent) {
      if (!updateTag.sub_tags.includes(tag.id)) {
        updateTag.sub_tags.push(tag.id);
        await tag.save();
      }
    }
  }

  // async deleteSubTag(id: string): Promise<Tag> {
  //   const tag: Tag = await this.tagModel.findByIdAndUpdate(id, {
  //     deleted: false,
  //   });
  //   for (const item of tag.sub_tags) {
  //     await this.tagModel.findOneAndUpdate({ name: item }, { deleted: true });
  //   }
  //   return tag;
  // }

  async deleteTag(id: string): Promise<string> {
    const tag: Tag = await this.tagModel.findById(id);
    if (!tag)
      throw new NotFoundException({
        status: false,
        message: 'Tag not found',
      });
    tag.deleted = true;
    for (const item of tag.sub_tags) {
      await this.tagModel.findByIdAndUpdate(item, { deleted: true });
    }
    await tag.save();
    return 'Tag deleted successfully';
  }
}
