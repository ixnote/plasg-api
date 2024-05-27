import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsEnum, IsOptional, IsString } from 'class-validator';
import { TagType } from 'src/common/constants/enum';

export class AddTagDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  description: string;

  @ApiProperty()
  @IsArray()
  @IsOptional()
  sub_tags: string[];

  @ApiProperty()
  @IsEnum(TagType)
  type: string;

}
