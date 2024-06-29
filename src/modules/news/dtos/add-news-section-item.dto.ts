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
  image: string;
}
