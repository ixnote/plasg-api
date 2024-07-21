import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsMongoId, IsOptional, IsString, IsUrl, ValidateIf } from 'class-validator';

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
