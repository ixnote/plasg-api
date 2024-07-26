import { Data } from './../data/interfaces/data.interface';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AddNewsSectionDto } from './dtos/add-news-section.dto';
import { NewsService } from './services/news.service';
import { News } from './interfaces/news.interface';
import { UserGuard } from 'src/framework/guards/user.guard';
import { User } from '../user/interfaces/user.interface';
import { NewsPaginationDto } from './dtos/news-pagination.dto';
import { AuthGuard } from 'src/framework/guards/auth.guard';
import { UpdateNewsDto } from './dtos/updat-news.dto';
import { Roles } from 'src/common/decorators/roles.decorator';
import { RolesGuard } from 'src/framework/guards/roles.guard';
import { UserRoles } from 'src/common/constants/enum';
import { GetArticlesMdaDto } from './dtos/get-articles-param.dto';
import { RemoveTagDto } from './dtos/remove-news-tag.dto';
import { AddNewsTagsDto } from './dtos/add-news-tags.dto';
import { AddNewsDto } from './dtos/add-news.dto';
import { GetNewsDto } from './dtos/get-news.dto';
import { AddNewsSectionItemsDto } from './dtos/add-news-section-item.dto';
import { GetSectionDto } from './dtos/get-section.dto';
import { ReorderNewsSectionItemsDto } from './dtos/reorder-news-section-item.dto';

@Controller('news')
export class NewsController {
  constructor(private newsService: NewsService) {}

  @Get('/')
  async getNewsFromNewsMda(@Query() query: NewsPaginationDto) {
    const results = await this.newsService.findNews(query);
    return {
      status: true,
      message: 'News fetched successfully',
      data: results,
    };
  }

  @Get('/articles/:mda')
  async getNews(
    @Query() query: NewsPaginationDto,
    @Param() param: { mda: string },
  ) {
    const results = await this.newsService.findMdaArticles(query, param);
    return {
      status: true,
      message: 'News fetched successfully',
      data: results,
    };
  }

  @Get('/aggregated')
  @UseGuards(AuthGuard)
  async getAggregatedNewsPerMda() {
    const results = await this.newsService.getAggregatedNewsPerMda();
    return {
      status: true,
      message: 'Dara fetched successfully',
      data: results,
    };
  }

  @Get('/admin/articles')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRoles.MDA)
  async getNewsAdmin(
    @Query() query: NewsPaginationDto,
    @UserGuard() user: User,
  ) {
    const results = await this.newsService.findMdaArticlesAdmin(query, user);
    return {
      status: true,
      message: 'News fetched successfully',
      data: results,
    };
  }

  @Get('/:newsId')
  async getSIngle(@Param() param: { newsId: string }) {
    const news: News = await this.newsService.getSingle(param);
    return {
      status: true,
      message: 'News fetched successfully',
      data: news,
    };
  }

  @Post('/add')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRoles.MDA)
  async addNews(@Body() body: AddNewsDto, @UserGuard() user: User) {
    const news: News = await this.newsService.create(body, user);
    return {
      status: true,
      message: 'News added successfully',
      data: news,
    };
  }

  @Put('/update/:newsId')
  @UseGuards(AuthGuard)
  async updateNews(
    @Param() param: { newsId: string },
    @Body() body: UpdateNewsDto,
    @UserGuard() user: User,
  ) {
    const news: News = await this.newsService.updateNews(param.newsId, body);
    return {
      status: true,
      message: 'News updated successfully',
      data: news,
    };
  }

  @Put('/section/add/:newsId')
  async addNewsSections(
    @Param() param: { newsId: string },
    @Body() body: AddNewsSectionDto,
  ) {
    body.newsId = param.newsId;
    const news: News = await this.newsService.addNewsSections(body);
    return {
      status: true,
      message: 'News sections added successfully',
      data: news,
    };
  }

  @Patch('/section/update/:sectionId')
  async updateNewsSection(
    @Param() param: GetSectionDto,
    body: AddNewsSectionItemsDto,
    @UserGuard() user: User,
  ) {
    await this.newsService.updateSection(body, param.sectionId, user);
    return {
      status: true,
      message: 'News sections updated successfully',
    };
  }

  @Patch('/section/reorder/:newsId')
  async reorderNewsSection(
    @Param() param: { newsId: string },
    body: ReorderNewsSectionItemsDto,
    @UserGuard() user: User,
  ) {
    // await this.newsService.reorderSection(body, param.newsId, user);
    return {
      status: true,
      message: 'News sections reordered successfully',
      Data: body,
    };
  }

  @Delete('/section/delete/:sectionId')
  async deleteNewsSection(
    @Param() param: GetSectionDto,
    @UserGuard() user: User,
  ) {
    const news: News = await this.newsService.removeSection(
      param.sectionId,
      user,
    );
    return {
      status: true,
      message: 'News section removed successfully',
      data: news,
    };
  }
  // @Put('/update')
  // @UseGuards(AuthGuard, RolesGuard)
  // @Roles(UserRoles.MDA)
  // async updateNews(@Body() body: AddNewsSectionDto, @UserGuard() user: User){
  //     const newNews: News = await this.newsService.create(body, user)
  //     body.newsId = newNews.id
  //     const news: News = await this.newsService.addNewsSections(body, user)
  //     return {
  //         status: true,
  //         message: "News added successfully",
  //         data: news
  //     }
  // }

  @Post('/add-news-tags/:newsId')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRoles.MDA)
  async addNewsTags(
    @Param() param: { newsId: string },
    @Body() body: AddNewsTagsDto,
    @UserGuard() user: User,
  ) {
    const news: News = await this.newsService.addNewsTags(param.newsId, body);
    return {
      status: true,
      message: 'News tags added successfully',
      data: news,
    };
  }

  @Delete('/delete/section/:sectionId')
  @UseGuards(AuthGuard)
  async deleteSection(
    @Param() param: { sectionId: string },
    @UserGuard() user: User,
  ) {
    await this.newsService.removeSection(param.sectionId, user);
    return {
      status: true,
      message: 'News section deleted successfully',
    };
  }

  @Delete('/delete/:newsId')
  @UseGuards(AuthGuard)
  async deleteNews(
    @Param() param: { newsId: string },
    @UserGuard() user: User,
  ) {
    await this.newsService.deleteNews(param, user);
    return {
      status: true,
      message: 'News deleted successfully',
    };
  }

  @Delete('/remove/:newsId/:tagId')
  @UseGuards(AuthGuard)
  @Roles(UserRoles.MDA)
  async removeNewsTag(@Param() param: RemoveTagDto) {
    await this.newsService.removeNewsTag(param);
    return {
      status: true,
      message: 'News tag removed successfully',
    };
  }

  @Put('/detach-tag/:newsId/:tagId')
  @UseGuards(AuthGuard)
  async detachTag(
    @Param() param: { newsId: string; tagId: string },
    @UserGuard() user: User,
  ) {
    const news: News = await this.newsService.detachTag(param, user);
    return {
      status: true,
      message: 'Tag detached successfully',
      data: news,
    };
  }

  @Put('/post/:newsId')
  @UseGuards(AuthGuard)
  async postNews(@Param() param: { newsId: string }, @UserGuard() user: User) {
    const news: News = await this.newsService.postNews(param.newsId, user);
    return {
      status: true,
      message: 'News posted successfully',
      data: news,
    };
  }

  @Put('/recall/:newsId')
  @UseGuards(AuthGuard)
  async recallNews(
    @Param() param: { newsId: string },
    @UserGuard() user: User,
  ) {
    const news: News = await this.newsService.recallNews(param.newsId, user);
    return {
      status: true,
      message: 'News recalled successfully',
      data: news,
    };
  }
}
