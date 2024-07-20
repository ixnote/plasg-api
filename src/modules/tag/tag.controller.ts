import { Body, Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common';
import { TagService } from './services/tag.service';
import { RolesGuard } from 'src/framework/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { UserRoles } from 'src/common/constants/enum';
import { AddTagDto } from './dtos/Add-tag.dto';
import { Tag } from './interfaces/tag.interface';
import { AuthGuard } from 'src/framework/guards/auth.guard';

@Controller('tag')
export class TagController {
    constructor(
        private tagService: TagService
    ){}

    @Post('/add')
    @UseGuards(AuthGuard, RolesGuard)
    @Roles(UserRoles.SUPER)
    async addTag(@Body() body: AddTagDto){
        const tag: Tag = await this.tagService.addTag(body)
        return {
            status: true,
            message: "Tag created successfully",
            data: tag
        }
    }

    @Get('/topics')
    async getTopics(){
        const tags: Tag[] = await this.tagService.getTopicTags()
        return {
            status: true,
            message: "Topics fetched successfully",
            data: tags
        }
    }

    @Get('/types')
    async getTypes(){
        const tags: Tag[] = await this.tagService.getTypeTags()
        return {
            status: true,
            message: "Types fetched successfully",
            data: tags
        }
    }

    @Get('/news')
    async getNewsTags(){
        const tags: Tag[] = await this.tagService.getNewsTags()
        return {
            status: true,
            message: "News tags fetched successfully",
            data: tags
        }
    }

    @Delete('/delete/:tagId')
    async deleteTag(@Param() param: {tagId: string}){
        const message: string = await this.tagService.deleteTag(param.tagId)
        return {
            status: true,
            message
        }
    }
}
