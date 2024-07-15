import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsMongoId, IsOptional, IsString, IsUrl, ValidateIf } from 'class-validator';
import mongoose from 'mongoose';

export class CreateResourceDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  @IsUrl()
  link: string;

  @ApiProperty()
  @IsString()
  description: string;

  @ApiProperty()
  @IsMongoId()
  main_type_tag: string;

  @ApiProperty()
  @IsMongoId()
  sub_type_tag: string;

  @ApiProperty()
  @IsString()
  @IsMongoId()
  main_topic_tag: string;

  @ApiProperty()
  @IsString()
  @IsMongoId()
  sub_topic_tag: string;

  @ApiProperty()
  @IsArray()
  @ValidateIf((object, value) => value && value.length > 0)
  // isValidMongooseId(value: string): boolean {
  //   return mongoose.Types.ObjectId.isValid(value);
  // }
  all_topic_tags: string[];
}
