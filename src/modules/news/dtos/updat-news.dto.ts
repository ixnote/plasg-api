import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsMongoId,
  IsOptional,
  IsString,
} from 'class-validator';

export class UpdateNewsDto {
  @ApiProperty()
  @IsString()
  @IsOptional()
  reference: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  image: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  headline: string;

  @ApiProperty()
  @IsArray()
  @IsMongoId({ each: true }) 
  @IsOptional()
  tags: string[];
}
