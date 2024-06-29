import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { AddNewsSectionDto } from '../dtos/add-news-section.dto';
import { NewsSection } from '../interfaces/newsSection.interface';
import { News } from '../interfaces/news.interface';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { CreateNews } from '../interfaces/create-news.interface';
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

@Injectable()
export class NewsService {
  constructor(
    @InjectModel('News') private newsModel: Model<News>,
    @InjectModel('NewsSection') private newsSectionModel: Model<NewsSection>,
    private mdaService: MdaService,
    private miscService: MiscClass,
    private tagService: TagService,
  ) {}

  private async checkIfUserIsAuthorized(user: User): Promise<boolean>{
    const mda: Mda = await this.mdaService.findByUser(user.id);
    if (mda?.name !== 'News' && user.role !== UserRoles.SUPER)
      throw new ForbiddenException({
        status: false,
        message: 'Forbidden',
      });
    return true
  }

  async create(body: CreateNews): Promise<News> {
    const createdNews = new this.newsModel(body);
    return createdNews.save();
  }

  async findAll(): Promise<News[]> {
    return this.newsModel.find().populate('newsSections').exec();
  }

  async findById(id: string): Promise<News> {
    return (
      await this.newsModel
        .findById(id)
        .populate('newsSections', 'paragraph image')
    ).populate('tags', 'name type description');
  }

  async createNewsSections(
    newsId: string,
    body: AddNewsSectionItemsDto,
  ): Promise<NewsSection> {
    const newsSection = new this.newsSectionModel({ ...body, news: newsId });
    return await newsSection.save();
  }

  async findNewsSectionById(id: string): Promise<NewsSection> {
    return this.newsSectionModel.findById(id);
  }

  async deleteNewsSectionById(newsSectionId: string) {
    return await this.newsSectionModel.findByIdAndDelete();
  }

  async addNewsSections(body: AddNewsSectionDto, user: User): Promise<News> {
   await this.checkIfUserIsAuthorized(user)
    const news: News = await this.findById(body.newsId);
    if (!news)
      throw new NotFoundException({
        status: false,
        message: 'News not found',
      });
    let newsSectionIds: any[] = [];
    for (const item of body.items) {
      const newsSections = await this.createNewsSections(news.id, item);
      newsSectionIds.push(newsSections.id);
    }
    news.newsSections = news.newsSections.concat(...newsSectionIds);
    return await news.save();
  }

  async removeSection(sectionId: string, user: User): Promise<News> {
    await this.checkIfUserIsAuthorized(user)
    const section: NewsSection = await this.findNewsSectionById(sectionId);
    if (!section)
      throw new NotFoundException({
        status: false,
        message: 'Section not found',
      });
    const news: News = await this.findById(section.news.toString());
    const newArray = news.newsSections.filter((item) => item.id !== section.id);
    news.newsSections = newArray
    await this.newsSectionModel.findByIdAndDelete(section.id);
    return await news.save();
  }

  async deleteNews(body: { newsId: string }, user: User) {
    await this.checkIfUserIsAuthorized(user)
    const news: News = await this.newsModel.findById(body.newsId);
    const objectIdsToDelete = news.newsSections.map(
      (id) => new mongoose.Types.ObjectId(id),
    );
    await this.newsSectionModel.deleteMany({ _id: { $in:objectIdsToDelete}});
    await this.newsModel.findByIdAndDelete(body.newsId);
  }

  async findNews(body: NewsPaginationDto): Promise<any> {
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
    const totalNewsCount = newsTotal.length;
    const totalPages = Math.ceil(totalNewsCount / pageSize);
    const nextPage = Number(page) < totalPages ? Number(page) + 1 : null;
    const prevPage = Number(page) > 1 ? Number(page) - 1 : null;

    const news: News[] = await this.newsModel
      .find(options)
      .populate('newsSections')
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

  async getSingle(body: { newsId: string }): Promise<News> {
    const news: News = await this.findById(body.newsId);
    if (!news)
      throw new NotFoundException({
        status: false,
        message: 'News not found',
      });
    return news;
  }

  async updateSection(body: AddNewsSectionItemsDto, sectionId: string, user: User) {
    await this.checkIfUserIsAuthorized(user)
    const section: NewsSection = await this.findNewsSectionById(sectionId);
    if (!section)
      throw new NotFoundException({
        status: false,
        message: 'Section not found',
      });
    if (!body.image) delete body.image;
    if (!body.paragraph) delete body.paragraph;
    return await this.newsSectionModel.findByIdAndUpdate(section.id, body, {
      new: true,
    });
  }

  async postNews(newsId: string, user: User) {
    await this.checkIfUserIsAuthorized(user)
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
    await this.checkIfUserIsAuthorized(user)
    const news: News = await this.findById(newsId);
    if (!news)
      throw new NotFoundException({
        status: false,
        message: 'News not found',
      });
    news.is_posted = false;
    return await news.save();
  }

  async updateNews(body: UpdateNewsDto, user: User): Promise<News> {
    const { headline, tags, items } = body;
    const news: News = await this.newsModel.findById(body.tags);
    if (tags) {
      const newsTagsObjectIds = news.tags.map(
        (tag) => new mongoose.Types.ObjectId(tag),
      );
      const tagsObjectIds = tags.map((tag) => new mongoose.Types.ObjectId(tag));
      const combinedArray = newsTagsObjectIds.concat(tagsObjectIds);
      news.tags = combinedArray
    }
    if(headline) news.headline = headline
    if(items){
      let newsSectionIds: any[] = [];
      for (const item of items) {
        const newsSections = await this.createNewsSections(news.id, item);
        newsSectionIds.push(newsSections.id);
      }
      news.newsSections = news.newsSections.concat(...newsSectionIds);
    }
    return await news.save()
  }

  async detachTag(body: {tagId : string, newsId: string}, user: User) {
    await this.checkIfUserIsAuthorized(user)
    const news: News = await this.newsModel.findById(body.newsId);    if (!news)
      throw new NotFoundException({
        status: false,
        message: 'News not found',
      });
      const newArray = news.tags.filter(item => item.toString() != body.tagId);
      news.tags = newArray
      return await news.save()

  }
}
