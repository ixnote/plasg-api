import { ApiProperty } from '@nestjs/swagger';
import {
  IsMongoId,
  IsString,
} from 'class-validator';

export class GetArticlesMdaDto {
  @ApiProperty()
//   @IsString()
//   @IsMongoId()
  mdaId: string
}

// if (tags) {
//     const newsTagsObjectIds = news.tags.map(
//       (tag) => new mongoose.Types.ObjectId(tag),
//     );
//     const tagsObjectIds = tags.map((tag) => new mongoose.Types.ObjectId(tag));
//     const combinedArray = newsTagsObjectIds.concat(tagsObjectIds);
//     news.tags = combinedArray;
//   }
//   if (headline) news.headline = headline;
//   if (items) {
//     let newsSectionIds: any[] = [];
//     for (const item of items) {
//       const newsSections = await this.createNewsSections(news.id, item);
//       newsSectionIds.push(newsSections.id);
//     }
//     news.newsSections = news.newsSections.concat(...newsSectionIds);
//   }
//   return await news.save();