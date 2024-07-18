import { ApiProperty } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
} from 'class-validator';

export class AddNewsSectionItemsDto {
  @ApiProperty()
  @IsString()
  @IsOptional()
  heading: string

  @ApiProperty()
  @IsString()
  @IsOptional()
  highlight: string

  @ApiProperty()
  @IsString()
  @IsOptional()
  text: string

  @ApiProperty()
  @IsString()
  @IsOptional()
  paragraph: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  video: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  bullet: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  hyperlink: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  sub_heading: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  image: string;
}
