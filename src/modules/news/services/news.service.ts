/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
  InternalServerErrorException,
} from '@nestjs/common';
import { AddNewsSectionDto } from '../dtos/add-news-section.dto';
import { NewsSection } from '../interfaces/newsSection.interface';
import { News } from '../interfaces/news.interface';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { AddNewsSectionItemsDto } from '../dtos/add-news-section-item.dto';
import { User } from 'src/modules/user/interfaces/user.interface';
import { MdaService } from 'src/modules/mda/services/mda.service';
import { Mda } from 'src/modules/mda/interfaces/mda.interface';
import { MiscClass } from 'src/common/services/misc.service';
import { NewsPaginationDto } from '../dtos/news-pagination.dto';
import { TagService } from 'src/modules/tag/services/tag.service';
import { Tag } from 'src/modules/tag/interfaces/tag.interface';
import { UpdateNewsDto } from '../dtos/updat-news.dto';
import { UserRoles } from 'src/common/constants/enum';
import { AddNewsTagsDto } from '../dtos/add-news-tags.dto';
import { RemoveTagDto } from '../dtos/remove-news-tag.dto';
import { AddNewsDto } from '../dtos/add-news.dto';
import slugify from 'slugify';
import { GetNewsDto } from '../dtos/get-news.dto';
import { GlobalSearchPaginationDto } from 'src/modules/statics/dtos/global-search.dto';

@Injectable()
export class NewsService {
  constructor(
    @InjectModel('News') private newsModel: Model<News>,
    @InjectModel('NewsSection') private newsSectionModel: Model<NewsSection>,
    private mdaService: MdaService,
    private miscService: MiscClass,
    private tagService: TagService,
  ) {}

  private async checkIfUserIsAuthorized(user: User): Promise<boolean> {
    const mda: Mda = await this.mdaService.findByUser(user.id);
    if (!mda && user.role !== UserRoles.SUPER)
      throw new UnauthorizedException({
        status: false,
        message: 'Unauthorized',
      });
    return true;
  }

  async create(body: AddNewsDto, user: User): Promise<News> {
    const findMda: Mda = await this.mdaService.findByUser(user.id);
    if (!findMda)
      throw new UnauthorizedException({
        status: false,
        message: 'Not Authorized',
      });
    const slug = slugify(body.headline, '_');
    const createdNews = new this.newsModel({ ...body, mda: findMda.id, slug });
    return createdNews.save();
  }

  async addNewsTags(newsId: string, body: AddNewsTagsDto): Promise<News> {
    const news: News = await this.newsModel.findById(newsId);
    for (let i = 0; i < body.tags.length; i++) {
      const tagId = new mongoose.Types.ObjectId(body.tags[i]);
      let existingTagIndex = -1;
      for (const tag of news.tags) {
        if (tag.toString() === tagId.toString()) {
          existingTagIndex = 1;
        }
      }
      if (existingTagIndex !== -1) {
        news.tags[existingTagIndex] = tagId;
      } else {
        news.tags.push(tagId);
      }
    }

    await news.save();
    return news;
  }

  async removeNewsTag(body: RemoveTagDto): Promise<News> {
    const news: News = await this.findById(body.newsId);
    if (!news) {
      throw new NotFoundException({
        status: false,
        message: 'Mda not found',
      });
    }

    if (!news.tags) {
      throw new NotFoundException({
        status: false,
        message: 'No tags to remove',
      });
    }

    news.tags = news.tags.filter((tag) => tag.id.toString() !== body.tagId);

    await news.save();

    return news;
  }

  async totalNumberOfNews(): Promise<number> {
    const news: News[] = await this.newsModel.find();
    return news.length;
  }
  async findAll(): Promise<News[]> {
    return this.newsModel.find().populate('newsSections').exec();
  }

  async findById(id: string): Promise<News> {
    if (!(await this.newsModel.findById(id)))
      throw new NotFoundException({
        status: false,
        message: 'Mda not found',
      });
    return await this.newsModel
      .findById(id)
      .populate({
        path: 'newsSections',
        select: 'type value position',
        options: { sort: { position: 1 } },
      })
      .populate('mda', 'name logo')
      .populate('tags', 'name type description');
  }

  async createNewsSections(
    newsId: string,
    body: AddNewsSectionItemsDto,
  ): Promise<NewsSection> {
    const newsSection = new this.newsSectionModel({ ...body, news: newsId });
    return await newsSection.save();
  }

  async regexSearch(body: GlobalSearchPaginationDto): Promise<any> {
    const { page = 1, pageSize = 10, name } = body;
    const usePage: number = body.page < 1 ? 1 : body.page;
    const pagination = await this.miscService.paginate({
      page: usePage,
      pageSize: body.pageSize,
    });
    const $regex = new RegExp(body.name, 'i');
    const news: News[] = await this.newsModel
      .find({ name: { $regex } })
      .populate('newsSections', 'type value')
      .populate('mda', 'name logo')
      .populate('tags', 'name type description')
      .skip(pagination.offset)
      .limit(pagination.limit);

    const totalNews: News[] = await this.newsModel
      .find({ name: { $regex } })
      .populate('newsSections', 'type value')
      .populate('mda', 'name logo')
      .populate('tags', 'name type description');

    const total = totalNews.length;
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
      news,
    };
  }

  async findNewsSectionById(id: string): Promise<NewsSection> {
    return this.newsSectionModel.findById(id);
  }

  async deleteNewsSectionById() {
    return await this.newsSectionModel.findByIdAndDelete();
  }

  async addNewsSections(body: AddNewsSectionDto): Promise<News> {
    // await this.checkIfUserIsAuthorized(user);
    try {
      const news: News = await this.findById(body.newsId);
      if (!news)
        throw new NotFoundException({
          status: false,
          message: 'News not found',
        });
      const newsSectionIds: any[] = [];
      for (const item of body.items) {
        const newsSections = await this.createNewsSections(news.id, item);
        newsSectionIds.push(newsSections.id);
      }
      news.newsSections = news.newsSections.concat(newsSectionIds);
      return await news.save();
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async updateSection(
    body: AddNewsSectionItemsDto,
    sectionId: string,
    user: User,
  ) {
    await this.checkIfUserIsAuthorized(user);
    const section: NewsSection = await this.findNewsSectionById(sectionId);
    if (!section)
      throw new NotFoundException({
        status: false,
        message: 'Section not found',
      });
    return await this.newsSectionModel.findByIdAndUpdate(section.id, body, {
      new: true,
    });
  }

  async reorderSection(body: any, param: GetNewsDto, user: User) {
    await this.checkIfUserIsAuthorized(user);
    const news: News = await this.findById(param.newsId);
    if (!news)
      throw new NotFoundException({
        status: false,
        message: 'News not found',
      });
    const sectionFoundQuery = [];
    const sectionUpdateQuery = [];
    try {
      for (const item of body.sections) {
        const foundResult = this.findNewsSectionById(item.id);
        const updateResult = this.newsSectionModel.findByIdAndUpdate(
          item.id,
          { position: item.position },
          {
            new: true,
          },
        );
        sectionFoundQuery.push(foundResult);
        sectionUpdateQuery.push(updateResult);
      }

      const foundSections = await Promise.all(sectionFoundQuery);
      const isFound = foundSections.every(Boolean);

      if (!isFound)
        throw new NotFoundException({
          status: false,
          message: 'Sections not found',
        });

      return await Promise.all(sectionUpdateQuery);
    } catch (error) {
      throw new InternalServerErrorException({
        status: false,
        message: 'Internal Server Error',
      });
    }
  }

  async removeSection(sectionId: string, user: User): Promise<News> {
    await this.checkIfUserIsAuthorized(user);
    const section: NewsSection = await this.findNewsSectionById(sectionId);
    if (!section)
      throw new NotFoundException({
        status: false,
        message: 'Section not found',
      });
    const news: News = await this.findById(section.news.toString());
    const newArray = news.newsSections.filter((item) => item.id !== section.id);
    news.newsSections = newArray;
    await this.newsSectionModel.findByIdAndDelete(section.id);
    return await news.save();
  }

  async deleteNews(body: { newsId: string }, user: User) {
    await this.checkIfUserIsAuthorized(user);
    const news: News = await this.newsModel.findById(body.newsId);
    const objectIdsToDelete = news.newsSections.map(
      (id) => new mongoose.Types.ObjectId(id),
    );
    await this.newsSectionModel.deleteMany({ _id: { $in: objectIdsToDelete } });
    await this.newsModel.findByIdAndDelete(body.newsId);
  }

  async findMdaArticles(
    body: NewsPaginationDto,
    param: { mda: string },
  ): Promise<any> {
    const { page = 1, pageSize = 10, ...rest } = body;
    const usePage: number = page < 1 ? 1 : page;
    const pagination = await this.miscService.paginate({
      page: usePage,
      pageSize,
    });
    const tag = rest.tag;

    delete rest.tag;
    const options: any = await this.miscService.search(rest);
    const newsTotal: News[] = await this.newsModel.find(options);

    if (tag) {
      const tag: Tag = await this.tagService.findById(body.tag);
      if (!tag)
        throw new NotFoundException({
          status: false,
          message: 'Tag not found',
        });
      options.tags = { $in: [tag] };
    }
    options.is_posted = true;
    const totalNewsCount = newsTotal.length;
    const totalPages = Math.ceil(totalNewsCount / pageSize);
    const nextPage = Number(page) < totalPages ? Number(page) + 1 : null;
    const prevPage = Number(page) > 1 ? Number(page) - 1 : null;
    const news: News[] = await this.newsModel
      .find({ ...options, mda: param.mda })
      .populate({
        path: 'newsSections',
        options: { sort: { position: 1 } },
      })
      .populate('tags')
      .skip(pagination.offset)
      .limit(pagination.limit)
      .sort({ createdAt: -1 });
    return {
      pagination: {
        currentPage: Number(usePage),
        totalPages,
        nextPage,
        prevPage,
        totalNews: totalNewsCount,
        pageSize: Number(pageSize),
      },
      news,
    };
  }

  async findMdaArticlesAdmin(
    body: NewsPaginationDto,
    user: User,
  ): Promise<any> {
    const { page = 1, pageSize = 10, ...rest } = body;
    const usePage: number = page < 1 ? 1 : page;
    const pagination = await this.miscService.paginate({
      page: usePage,
      pageSize,
    });
    const tag = rest.tag;
    const mda: Mda = await this.mdaService.findByUser(user.id);
    if (!mda)
      throw new UnauthorizedException({
        status: false,
        message: 'User is not assigned to any mda',
      });
    delete rest.tag;
    const options: any = await this.miscService.search(rest);
    const newsTotal: News[] = await this.newsModel.find(options);

    if (tag) {
      const tag: Tag = await this.tagService.findById(body.tag);
      if (!tag)
        throw new NotFoundException({
          status: false,
          message: 'Tag not found',
        });
      options.tags = { $in: [tag] };
    }
    const totalNewsCount = newsTotal.length;
    const totalPages = Math.ceil(totalNewsCount / pageSize);
    const nextPage = Number(page) < totalPages ? Number(page) + 1 : null;
    const prevPage = Number(page) > 1 ? Number(page) - 1 : null;
    const news: News[] = await this.newsModel
      .find({ ...options, mda: mda.id })
      .populate({
        path: 'newsSections',
        options: { sort: { position: 1 } },
      })
      .populate('tags')
      .skip(pagination.offset)
      .limit(pagination.limit)
      .sort({ createdAt: -1 });
    return {
      pagination: {
        currentPage: Number(usePage),
        totalPages,
        nextPage,
        prevPage,
        totalNews: totalNewsCount,
        pageSize: Number(pageSize),
      },
      news,
    };
  }

  async getAggregatedNewsPerMda() {
    const aggregatedNews = await this.newsModel
      .aggregate([
        {
          $project: {
            mda: 1,
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
          },
        },
        {
          $group: {
            _id: { mda: '$mda', year: '$year', month: '$month' },
            count: { $sum: 1 },
          },
        },
        {
          $sort: {
            '_id.year': 1,
            '_id.month': 1,
          },
        },
        {
          $lookup: {
            from: 'mdas', // The collection name of MDAs
            localField: '_id.mda',
            foreignField: '_id',
            as: 'mdaDetails',
          },
        },
        {
          $unwind: '$mdaDetails',
        },
        {
          $group: {
            _id: '$mdaDetails',
            newsByMonth: {
              $push: {
                year: '$_id.year',
                month: '$_id.month',
                count: '$count',
              },
            },
          },
        },
        {
          $project: {
            mda: '$_id',
            newsByMonth: 1,
            _id: 0,
          },
        },
        {
          $sort: {
            'mda.name': 1, // Assuming MDA has a name field, adjust accordingly
          },
        },
      ])
      .exec();

    return aggregatedNews;
  }

  async findNews(body: NewsPaginationDto): Promise<any> {
    const { page = 1, pageSize = 10, ...rest } = body;
    const usePage: number = page < 1 ? 1 : page;
    const mda: Mda = await this.mdaService.findByName('News');
    const pagination = await this.miscService.paginate({
      page: usePage,
      pageSize,
    });
    const tag = rest.tag;

    delete rest.tag;
    const options: any = await this.miscService.search(rest);
    const newsTotal: News[] = await this.newsModel.find({
      ...options,
      mda: mda.id,
      is_posted: true,
    });

    if (tag) {
      const tag: Tag = await this.tagService.findById(body.tag);
      if (!tag)
        throw new NotFoundException({
          status: false,
          message: 'Tag not found',
        });
      options.tags = { $in: [tag] };
    }
    const totalNewsCount = newsTotal.length;
    const totalPages = Math.ceil(totalNewsCount / pageSize);
    const nextPage = Number(page) < totalPages ? Number(page) + 1 : null;
    const prevPage = Number(page) > 1 ? Number(page) - 1 : null;

    const news: News[] = await this.newsModel
      .find({ ...options, mda: mda.id, is_posted: true })
      .populate({
        path: 'newsSections',
        options: { sort: { position: 1 } },
      })
      .populate('tags', 'name')
      .skip(pagination.offset)
      .limit(pagination.limit)
      .sort({ createdAt: -1 });

    return {
      pagination: {
        currentPage: Number(usePage),
        totalPages,
        nextPage,
        prevPage,
        totalNews: totalNewsCount,
        pageSize: Number(pageSize),
      },
      news,
    };
  }

  async getSingle(body: { newsId: string }): Promise<News> {
    const news: News = await this.findById(body.newsId);
    if (!news)
      throw new NotFoundException({
        status: false,
        message: 'News not found',
      });
    return news;
  }

  async postNews(newsId: string, user: User) {
    await this.checkIfUserIsAuthorized(user);
    const news: News = await this.findById(newsId);
    if (!news)
      throw new NotFoundException({
        status: false,
        message: 'News not found',
      });
    news.is_posted = true;
    return await news.save();
  }

  async recallNews(newsId: string, user: User) {
    await this.checkIfUserIsAuthorized(user);
    const news: News = await this.findById(newsId);
    if (!news)
      throw new NotFoundException({
        status: false,
        message: 'News not found',
      });
    news.is_posted = false;
    return await news.save();
  }

  async updateNews(newsId: string, body: UpdateNewsDto): Promise<News> {
    const news: News = await this.newsModel.findById(newsId);
    let tags = [];
    tags = news?.tags;
    if (news.tags) {
      for (let i = 0; i < body.tags.length; i++) {
        const tagId = new mongoose.Types.ObjectId(body.tags[i]);
        let existingTagIndex = -1;
        for (let j = 0; j < news.tags.length; j++) {
          if (news.tags[j].toString() === tagId.toString()) {
            existingTagIndex = j;
            break;
          }
        }
        if (existingTagIndex !== -1) {
          news.tags[existingTagIndex] = tagId;
        } else {
          tags.push(tagId);
        }
      }
    }
    body.tags = tags;
    if (!news)
      throw new NotFoundException({
        status: true,
        message: 'News not found',
      });
    return await this.newsModel.findByIdAndUpdate(newsId, body, { new: true });
  }

  async publishNews(
    newsId: string,
    body: { is_posted: boolean },
  ): Promise<News> {
    const news: News = await this.newsModel.findById(newsId);
    if (!news)
      throw new NotFoundException({
        status: true,
        message: 'News not found',
      });
    return await this.newsModel.findByIdAndUpdate(newsId, body, { new: true });
  }

  async detachTag(body: { tagId: string; newsId: string }, user: User) {
    await this.checkIfUserIsAuthorized(user);
    const news: News = await this.newsModel.findById(body.newsId);
    if (!news)
      throw new NotFoundException({
        status: false,
        message: 'News not found',
      });
    const newArray = news.tags.filter((item) => item.toString() != body.tagId);
    news.tags = newArray;
    return await news.save();
  }

  async getTotalNewsToday(mdaId: mongoose.Types.ObjectId): Promise<number> {
    const currentDate = new Date();
    const startOfDay = new Date(currentDate.setHours(0, 0, 0, 0));
    return await this.newsModel
      .countDocuments({ mda: mdaId, createdAt: { $gte: startOfDay } })
      .exec();
  }

  async getTotalNewsMonth(mdaId: mongoose.Types.ObjectId): Promise<number> {
    const currentDate = new Date();
    const startOfMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      1,
    );
    return await this.newsModel
      .countDocuments({ mda: mdaId, createdAt: { $gte: startOfMonth } })
      .exec();
  }

  async getTotalNewsAllTime(mdaId: mongoose.Types.ObjectId): Promise<number> {
    return await this.newsModel.countDocuments({ mda: mdaId }).exec();
  }
}
