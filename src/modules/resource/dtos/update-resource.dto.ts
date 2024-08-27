import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsMongoId, IsOptional, IsString, IsUrl, ValidateIf } from 'class-validator';
import { ResourceDocumentDto } from './resource-document.dto';
import { Type } from 'class-transformer';

export class UpdateResourceDto {
  @ApiProperty()
  @IsString()
  @IsOptional()
  title: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  name: string;

  @ApiProperty()
  @IsString()
  @IsUrl()
  @IsOptional()
  link: string;

  @ApiProperty()
  @IsString()
  @IsUrl()
  @IsOptional()
  image: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  body: string;

  @ApiProperty()
  @Type(() => ResourceDocumentDto)
  @IsOptional()
  document: ResourceDocumentDto;

  @ApiProperty()
  @IsString()
  @IsOptional()
  description: string;

  @ApiProperty()
  @IsMongoId()
  @IsOptional()
  main_type_tag: string;

  @ApiProperty()
  @IsMongoId()
  @IsOptional()
  sub_type_tag: string;

  @ApiProperty()
  @IsString()
  @IsMongoId()
  @IsOptional()
  main_topic_tag: string;

  @ApiProperty()
  @IsString()
  @IsMongoId()
  @IsOptional()
  sub_topic_tag: string;

  @ApiProperty()
  @IsArray()
  @ValidateIf((object, value) => value && value.length > 0)
  @IsOptional()
  all_topic_tags: string[];
}
