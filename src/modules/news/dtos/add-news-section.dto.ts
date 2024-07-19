import { ApiProperty } from '@nestjs/swagger';
import {
  isArray,
  IsArray,
  IsMongoId,
  IsOptional,
  IsString,
} from 'class-validator';
import { AddNewsSectionItemsDto } from './add-news-section-item.dto';

export class AddNewsSectionDto {
  @ApiProperty()
  @IsMongoId()
  @IsOptional()
  newsId: string

  @ApiProperty()
  @IsArray()
  items: AddNewsSectionItemsDto[];

}
