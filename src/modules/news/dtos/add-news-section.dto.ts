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
  @IsMongoId({ each: true }) // Validate each element in the array as a MongoDB ObjectId
  tags: string[];

  @ApiProperty()
  @IsString()
  headline: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  reference: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  image: string;

  @ApiProperty()
  @IsArray()
  items: AddNewsSectionItemsDto[];

}
