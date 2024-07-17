import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
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

@Controller('news')
export class NewsController {
    constructor(
        private newsService: NewsService
    ){}
   
    @Get('/articles')
    async getNews(@Query() query: NewsPaginationDto){
        const results = await this.newsService.findMdaArticles(query);
        return {
            status: true,
            message: "News fetched successfully",
            data: results
        }
    }

    @Get('/newsMda')
    async getNewsFromNewsMda(@Query() query: NewsPaginationDto){
        const results = await this.newsService.findNews(query);
        return {
            status: true,
            message: "News fetched successfully",
            data: results
        }
    }

    @Get('/:newsId')
    async getSIngle(@Param() param: {newsId: string}){
        const news: News = await this.newsService.getSingle(param);
        return {
            status: true,
            message: "News fetched successfully",
            data: news
        }
    }
    
    @Post('/add')
    @UseGuards(AuthGuard, RolesGuard)
    @Roles(UserRoles.MDA)
    async addNews(@Body() body: AddNewsSectionDto, @UserGuard() user: User){
        const newNews: News = await this.newsService.create(body, user)
        body.newsId = newNews.id
        const news: News = await this.newsService.addNewsSections(body, user)
        return {
            status: true,
            message: "News added successfully",
            data: news
        }
    }

    @Delete("/delete/section/:sectionId")
    @UseGuards(AuthGuard)
    async deleteSection(@Param() param: {sectionId: string}, @UserGuard() user: User){
        await this.newsService.removeSection(param.sectionId, user)
        return {
            status: true,
            message: "News section deleted successfully"
        }
    }

    @Delete('/delete/:newsId')
    @UseGuards(AuthGuard)
    async deleteNews(@Param() param: {newsId: string}, @UserGuard() user: User){
        await this.newsService.deleteNews(param, user)
        return {
            status: true,
            message: "News deleted successfully"
        }
    }

    @Put('/detach-tag/:newsId/:tagId')
    @UseGuards(AuthGuard)
    async detachTag(@Param() param: {newsId: string, tagId: string}, @UserGuard() user: User){
        const news: News = await this.newsService.detachTag(param, user)
        return {
            status: true,
            message: "Tag detached successfully",
            data: news
        }
    }

    @Put('/update/:newsId')
    @UseGuards(AuthGuard)
    async updateNews(@Body() body: UpdateNewsDto, @UserGuard() user: User){
        const news: News = await this.newsService.updateNews(body, user)
        return {
            status: true,
            message: "News updated successfully",
            data: news
        }
    }

    @Put('/post/:newsId')
    @UseGuards(AuthGuard)
    async postNews(@Param() param: {newsId: string}, @UserGuard() user: User){
        const news: News = await this.newsService.postNews(param.newsId, user)
        return {
            status: true,
            message: "News posted successfully",
            data: news
        }
    }

    @Put('/recall/:newsId')
    @UseGuards(AuthGuard)
    async recallNews(@Param() param: {newsId: string}, @UserGuard() user: User){
        const news: News = await this.newsService.recallNews(param.newsId, user)
        return {
            status: true,
            message: "News recalled successfully",
            data: news
        }
    }


}
