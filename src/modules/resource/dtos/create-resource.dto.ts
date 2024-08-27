import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsMongoId, IsOptional, IsString, IsUrl, ValidateIf } from 'class-validator';

export class CreateResourceDto {
  @ApiProperty()
  @IsString()
  @IsOptional()
  title: string;

  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  @IsUrl()
  @IsOptional()
  link: string;

  @ApiProperty()
  @IsString()
  description: string;

  @ApiProperty()
  @IsMongoId()
  main_type_tag: string;

  @ApiProperty()
  @IsMongoId()
  @IsOptional()
  sub_type_tag: string;

  @ApiProperty()
  @IsString()
  @IsUrl()
  @IsOptional()
  image: string;

  @ApiProperty()
  @IsString()
  @IsMongoId()
  main_topic_tag: string;

  @ApiProperty()
  @IsString()
  @IsMongoId()
  @IsOptional()
  sub_topic_tag: string;

  @ApiProperty()
  @IsArray()
  @ValidateIf((object, value) => value && value.length > 0)
  all_topic_tags: string[];
}
