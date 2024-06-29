import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsMongoId,
  IsOptional,
  IsString,
} from 'class-validator';
import { AddNewsSectionItemsDto } from './add-news-section-item.dto';

export class UpdateNewsDto {
  @ApiProperty()
  @IsMongoId()
  @IsOptional()
  newsId: string

  @ApiProperty()
  @IsArray()
  @IsMongoId({ each: true })
  @IsOptional()
  tags: string[];

  @ApiProperty()
  @IsString()
  @IsOptional()
  headline: string;

  @ApiProperty()
  @IsArray()
  @IsOptional()
  items: AddNewsSectionItemsDto[];

}
